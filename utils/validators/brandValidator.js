const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/valdatorMiddleware');

module.exports = {
    addNewBrandValidator: [
        check('name')
            .not()
            .isEmpty()
            .withMessage('Name is required')
            .custom((val, { req }) => {
                req.body.slug = slugify(val, { lower: true });
                return true;
            }),
        validatorMiddleware,
    ],
    updateBrandValidator: [
        check('id').isMongoId().withMessage('Invalid id'),
        check('name').optional().custom(((val, { req }) => {
            const slug = slugify(val, { lower: true });
            req.body.slug = slug;
            return true;
        })),
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