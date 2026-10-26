const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/valdatorMiddleware');

exports.addProductToCartValidator = [
    check('productId').isMongoId().notEmpty().withMessage('Product ID is required'),
    validatorMiddleware
];

exports.updateProductQuantityValidator = [
    check('productId').isMongoId().notEmpty().withMessage('Product ID is required'),
    check('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    validatorMiddleware
];

exports.deleteProductFromCartValidator = [
    check('itemId').isMongoId().notEmpty().withMessage('Item ID is required'),
    validatorMiddleware
];

