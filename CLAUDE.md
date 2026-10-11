# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # node --watch server.js (auto-restart on change)
npm run start:prod   # NODE_ENV=production via cross-env
npx eslint .         # no lint script; legacy .eslintrc.json (airbnb + prettier + plugin:node), ESLint 8
```

- There is no test framework; `npm test` is the default stub that exits 1.
- Seed or wipe products. The seeder uses paths relative to its own folder (`../../config.env`, `./products.json`), so it must be run from `utils/dummyData`:
  ```bash
  cd utils/dummyData && node seeder.js -i   # insert products.json; -d deletes all products
  ```

## Environment

- Config is loaded from `config.env` (not `.env`) using a CWD-relative path, so start the server from the repo root. The file is gitignored. Keys: `PORT`, `NODE_ENV`, `DB_URL`, `BASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_SECURE`, `EMAIL_FROM`.
- `NODE_ENV=development` turns on morgan logging and makes the error handler return `error` and `stack`.

## Architecture

Express 5 + Mongoose REST API using CommonJS. Routers are mounted in `server.js` under `/api/V1/...` (capital `V`). The prefixes are inconsistent: `category` and `subCategory` are singular; `brands`, `products`, `users` and `auth` are plural.

**Request pipeline for a protected write route** (look at any `routes/*.js`):
`authGate → verifyTo(...roles) → upload<X>Image (multer) → resizeImage (sharp) → <x>Validator → controller`
- Multer runs before the validator because the body arrives as multipart and is only parsed into `req.body` once multer has run.
- Multer keeps files in memory. Each controller's `resizeImage` writes a 600x600 JPEG to `uploads/<entity>/<Entity>-<timestamp>.jpeg` and puts only the **filename** in `req.body`. Sharp does not create missing folders. `uploads/products/` is empty and untracked, so it is missing on a fresh clone.
- Each model's `post('init')`/`post('save')` hooks turn the stored filename into a full URL, `${BASE_URL}/uploads/<entity>/<file>`. Static files are served from `/uploads`.

**Validators mutate the request.** Validators in `utils/validators/*` (express-validator `check` chains ending in `validatorMiddleware`) also set `req.body.slug = slugify(name|title)` in a `.custom()` step. That is where slugs come from. Validation failures return `400 { errors: [...] }` directly and do not go through `ApiError`.

**CRUD goes through `controllers/handlerFactory.js`**: `getAll(Model, searchKeys)`, `getOne`, `createOne`, `updateOne`, `deleteOne`. Most controllers just bind these to a model. Response shapes are `{ message, data: { document } }` and, for lists, `{ message, paginationResult, length, data: { documents } }`.

**List querying** (`utils/apiFeature.js`, used by `getAll`):
- Plain query params become Mongo filters. `gt|gte|lt|lte|ne` become `$`-operators; this depends on the `qs` query parser set in `server.js`, e.g. `?price[gte]=10`.
- `keyword` does a case-insensitive regex search over `searchKeys` (default `title`, `description`).
- `sort` and `fields` take comma-separated lists. The default sort is `-createdAt`.
- `page`/`limit` paginate, with a default limit of 10.
- A pre-filter can be passed in through `req.filteredObject`.

**Nested sub-categories**: `categoryRoutes` mounts `subCategoryRoutes` at `/:categoryId/subCategory` (the sub-router uses `mergeParams: true`). `setCategoryId` copies the param into the body on create. `createfilteredObject` sets `req.filteredObject` so that `getAll` is scoped to the category.

**Errors**:
- Throw or `next(new ApiError(message, statusCode))` (`utils/apiError.js`).
- Async handlers are wrapped in `express-async-handler`.
- `middlewares/errMiddleware.js` formats errors differently for dev and prod, and maps JWT errors to 401 in prod only.
- The catch-all 404 uses Express 5 wildcard syntax: `/{*splat}`.

**Auth** (`controllers/authController.js`):
- JWT payload is `{ id }`.
- `authGate` reads `Authorization: Bearer <token>`, loads the user into `req.user`, and rejects tokens issued before `passwordChangedAt`.
- `verifyTo(...roles)` checks `req.user.role`. `User.role` only allows `admin` and `user`, but category routes also allow `manager`.
- Passwords are hashed in `userModel`'s `pre('save')`. `findByIdAndUpdate` skips that hook, so `userController.changePassword` hashes manually and sets `passwordChangedAt`. `updateUser` uses a field whitelist, so passwords can't be changed through it.
- Forgot-password stores a sha256 hash of a 6-digit code with a 10-minute expiry (`resetPasswordCode`, `resetPasswordExpires`, `resetPasswordVerification`) and emails the code via `utils/emailSender.js` (nodemailer).

## Conventions

- 4-space indentation and CommonJS `require`.
- Controller functions are preceded by `// @desc`, `// @route`, `// @access` comment blocks.
- The validator middleware file is spelled `middlewares/valdatorMiddleware.js`; keep that spelling when importing it.
