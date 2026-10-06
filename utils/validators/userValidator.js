const slugify = require('slugify');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/valdatorMiddleware');
const UserModel = require('../../models/userModel');

module.exports = {
    addNewUserValidator: [
        check('name')
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 3 })
            .custom((val, { req }) => {
                req.body.slug = slugify(val, { lower: true });
                return true;
            }),

        check('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is invalid')
            .custom(async (val) => {
                const user = await UserModel.findOne({ email: val });

                if (user) {
                    throw new Error('Email already exists');
                }

                return true;
            }),
        check('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password is too short').
            custom((pass, { req }) => {
                if (pass !== req.body.passwordConfirm) {
                    throw new Error('password not equal password confirmation')
                }

                return true;
            })
        ,
        check('passwordConfirm').notEmpty().withMessage('Password confirmation is required'),
        check('profileImage')
            .optional(),
        check('role')
            .notEmpty()
            .withMessage('Role is required'),
        check('phone')
            .optional()
            .isMobilePhone(["ar-EG", "ar-SA"])
        ,
        validatorMiddleware,
    ],
    updateUserValidator: [
        check('id').isMongoId().withMessage('Invalid id'),
        check('name').optional().custom(((val, { req }) => {
            const slug = slugify(val, { lower: true });
            req.body.slug = slug;
            return true;
        })),
        check('email')
            .optional()
            .isEmail()
            .withMessage('Email is invalid')
            .custom(async (val) => {
                const user = await UserModel.findOne({ email: val });

                if (user) {
                    throw new Error('Email already exists');
                }

                return true;
            }),
        check('profileImage')
            .optional(),
        check('role')
            .notEmpty()
            .withMessage('Role is required'),
        check('phone')
            .optional()
            .isMobilePhone(["ar-EG", "ar-SA"]),
        validatorMiddleware,
    ],
    getUserValidator: [
        check('id').isMongoId().withMessage('Invalid id'),
        validatorMiddleware,
    ],
    deleteUserValidator: [
        check('id').isMongoId().withMessage('Invalid id'),
        validatorMiddleware
    ],

    changePasswordValidator: [
        check('id').isMongoId().withMessage('Invalid id'),
        check('password').notEmpty().withMessage('Password is required')
            .custom((pass, { req }) => {
                console.log(pass, req.body.passwordConfirm);
                if (pass !== req.body.passwordConfirm) {
                    throw new Error('Password does not match password confirmation');
                }
                if (pass === req.body.currentPassword) {
                    throw new Error('Current password is same as new password');
                }
                return true;
            }),
        check('passwordConfirm').notEmpty().withMessage('Password confirmation is required'),
        check('currentPassword').notEmpty().withMessage('Current password is required').custom(async (val, { req }) => {

            const user = await UserModel.findById(req.params.id);
            if (!user) {
                throw new Error('User not found');
            }

            const isPasswordMatch = await bcrypt.compare(val, user.password);
            if (!isPasswordMatch) {
                throw new Error('Current password is invalid');
            }

            return true;
        }),
        validatorMiddleware,
    ],
};