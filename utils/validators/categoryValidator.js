const slugify = require('slugify');

const { check } = require('express-validator');

const validatorMiddleware = require('../../middlewares/valdatorMiddleware');


const getCategoryByIdValidator = [
    check('id').isMongoId().withMessage('Invalid Category ID'),
    validatorMiddleware,
];

const addCategoryValidator = [
    check('name')
        .notEmpty().withMessage('category name is required')
        .isLength({ min: 3 }).withMessage('category name must be at least 3 characters')
        .isLength({ max: 32 }).withMessage('category name must be less than 32 characters')
        .custom((val, { req }) => {
            req.body.slug = slugify(val, { lower: true });
            return true;
        }),
    validatorMiddleware,
];

const updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category ID'),
    check('name')
        .notEmpty().withMessage('category name is required')
        .isLength({ min: 3 }).withMessage('category name must be at least 3 characters')
        .isLength({ max: 32 }).withMessage('category name must be less than 32 characters').custom((value, { req }) => {
            req.body.slug = slugify(value, { lower: true });
            return true;
        }),
    validatorMiddleware,
];

const deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category ID'),
    validatorMiddleware,
];
module.exports = {
    getCategoryByIdValidator,
    addCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
};