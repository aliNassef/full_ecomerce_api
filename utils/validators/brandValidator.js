const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/valdatorMiddleware');


module.exports = {
    addNewBrandValidator: [
        check('name').not().isEmpty().withMessage('Name is required'),
        validatorMiddleware,
    ],
    updateBrandValidator: [
        check('id').isMongoId().withMessage('Invalid id'),
        check('name').not().isEmpty().withMessage('Name is required'),
        validatorMiddleware,
    ],
    getBrandValidator: [
        check('id').isMongoId().withMessage('Invalid id'),
        validatorMiddleware,
    ],
    deleteBrandValidator: [
        check('id').isMongoId().withMessage('Invalid id'),
        validatorMiddleware
    ],
};