const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/valdatorMiddleware');

const wishlistValidator = [
    check('productId').isMongoId().withMessage('Please enter a valid product id'),
    validatorMiddleware
];



module.exports = {
    wishlistValidator
};