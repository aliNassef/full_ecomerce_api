const { check } = require('express-validator');

const validatorMiddleware = require('../../middlewares/valdatorMiddleware');

const ReviewModel = require('../../models/reviewModel');

const addreviewValidator = [
    check('product').isMongoId().withMessage('Please enter a valid product id'),
    check('rating').notEmpty().withMessage('Please enter a rating')
        .isLength({ min: 1 }).withMessage('Rating must be greater than 1')
        .isLength({ max: 5 }).withMessage('Rating must be less than 5'),
    check('user').isMongoId().withMessage('Please enter a valid user id').custom(async (val, { req }) => {
        const hasReview = await ReviewModel.findOne({ user: val, product: (req.body.productId || req.params.id) });
        if (hasReview) {
            throw new Error('User already has a review for this product');
        }
        return true;
    }),

    validatorMiddleware
];


const updatereviewValidator = [
    check('id').isMongoId().withMessage('Please enter a valid id').custom(async (val, { req }) => {
        const review = await ReviewModel.findOne({ _id: val });

        const { _id } = review.user;
        if (_id.toString() !== req.user._id.toString()) {
            throw new Error('You cannot update this review as it is not yours');
        }
        return true;
    }),
    check('rating').optional()
        .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    validatorMiddleware
];

const deletereviewValidator = [
    check('id').isMongoId().withMessage('Please enter a valid id').custom(async (val, { req }) => {
        const review = await ReviewModel.findOne({ _id: val });
        const { _id } = review.user;
        if (_id.toString() !== req.user._id.toString()) {
            if (req.user.role === 'admin') {
                return true;
            }
            throw new Error('You cannot Delete this review as it is not yours');
        }
        return true;
    }),
    validatorMiddleware
];

const getReviewById = [
    check('id').isMongoId().withMessage('Please enter a valid id'),
    validatorMiddleware
];


module.exports = {
    addreviewValidator,
    updatereviewValidator,
    deletereviewValidator,
    getReviewById
};
