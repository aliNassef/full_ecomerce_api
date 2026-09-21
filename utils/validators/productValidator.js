const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/valdatorMiddleware');
const CategoryModel = require('../../models/categoryModel');
const SubCategoryModel = require('../../models/subCategoryModel');

const productValidator = {
    addNewProductValidator: [
        check('title')
            .notEmpty()
            .withMessage('Title is required'),

        check('description')
            .notEmpty()
            .withMessage('Description is required'),

        check('price')
            .notEmpty()
            .withMessage('Price is required')
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),

        check('category')
            .notEmpty()
            .withMessage('Category is required')
            .isMongoId()
            .withMessage('Invalid category id')
            .custom(async (categoryId) => {
                const category = await CategoryModel.findById(categoryId);

                if (!category) {
                    throw new Error('Category does not exist');
                }

                return true;
            }),
        check('stock')
            .notEmpty()
            .withMessage('Stock is required')
            .isInt({ min: 0 })
            .withMessage('Stock must be a positive integer'),

        check('thumbnail')
            .notEmpty()
            .withMessage('Thumbnail is required'),

        check('brand')
            .optional()
            .isMongoId()
            .withMessage('Invalid brand id'),

        check('subcategory')
            .optional()
            .isArray()
            .withMessage('Subcategory must be an array')
            .custom(async (value) => {
                const subCategories = await SubCategoryModel.find({ _id: { $exists: true, $in: value } });
                if (value.length < 1 || subCategories.length !== value.length) {
                    throw new Error('Subcategory does not exist');
                }
                return true;
            })
            .custom(async (value, { req }) => {
                const subCategories = await SubCategoryModel.find({
                    _id: { $in: value },
                    category: req.body.category,
                });

                if (subCategories.length !== value.length) {
                    throw new Error(
                        'One or more subcategories do not exist or do not belong to this category'
                    );
                }

                return true;
            }),
        check('colors')
            .optional()
            .isArray()
            .withMessage('Colors must be an array'),

        validatorMiddleware
    ],

    updateProductValidator: [
        check('id')
            .isMongoId()
            .withMessage('Invalid id'),

        check('title')
            .optional()
            .notEmpty()
            .withMessage('Title cannot be empty'),

        check('description')
            .optional()
            .notEmpty()
            .withMessage('Description cannot be empty'),

        check('price')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),

        check('category')
            .optional()
            .isMongoId()
            .withMessage('Invalid category id'),

        check('stock')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Stock must be a positive integer'),

        check('thumbnail')
            .optional()
            .notEmpty()
            .withMessage('Thumbnail cannot be empty'),

        check('brand')
            .optional()
            .isMongoId()
            .withMessage('Invalid brand id'),

        check('subcategory')
            .optional()
            .isArray()
            .withMessage('Subcategory must be an array'),

        check('subcategory.*')
            .optional()
            .isMongoId()
            .withMessage('Invalid subcategory id'),

        check('colors')
            .optional()
            .isArray()
            .withMessage('Colors must be an array'),

        validatorMiddleware
    ],

    getProductValidator: [
        check('id')
            .isMongoId()
            .withMessage('Invalid id'),

        validatorMiddleware
    ],

    deleteProductValidator: [
        check('id')
            .isMongoId()
            .withMessage('Invalid id'),

        validatorMiddleware
    ],
};

module.exports = productValidator;