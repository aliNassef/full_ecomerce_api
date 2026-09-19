const { check } = require('express-validator');

const validatorMiddleware = require('../../middlewares/valdatorMiddleware');


const getSubCategoryyByIdValidator = [
    check('id').isMongoId().withMessage('Invalid SubCategory ID'),
    validatorMiddleware,
];

const addSubCategoryValidator = [
    check('name')
        .notEmpty().withMessage('SubCategory name is required')
        .isLength({ min: 2 }).withMessage('SubCategory name must be at least 3 characters')
        .isLength({ max: 32 }).withMessage('SubCategory name must be less than 32 characters'),
    check('category').isMongoId().withMessage('Invalid Category ID'),
    validatorMiddleware,
];

const updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid SubCategory ID'),
    check('name')
        .notEmpty().withMessage('SubCategory name is required')
        .isLength({ min: 2 }).withMessage('SubCategory name must be at least 2 characters')
        .isLength({ max: 32 }).withMessage('SubCategory name must be less than 32 characters'),
    check('category').isMongoId().withMessage('Invalid Category ID'),
    validatorMiddleware,
];

const deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid SubCategory ID'),
    validatorMiddleware,
];
module.exports = {
    getSubCategoryyByIdValidator,
    addSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
};