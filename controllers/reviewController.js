const handlerFactory = require('./handlerFactory');
const ReviewModel = require('../models/reviewModel');


// @desc Get all reviews
// @route GET /api/V1/reviews
// @access Public
const getReviews = handlerFactory.getAll(ReviewModel);

// @desc Get review by id
// @route GET /api/V1/reviews/:id
// @access Public
const getReviewById = handlerFactory.getOne(ReviewModel);

// @desc Add new review
// @route POST /api/V1/reviews
// @access Private / Protected / user
const addReview = handlerFactory.createOne(ReviewModel);

// @desc Update review
// @route PATCH /api/V1/reviews/:id
// @access Private / Protected / user
const updateReview = handlerFactory.updateOne(ReviewModel);

// @desc Delete review
// @route DELETE /api/V1/reviews/:id
// @access Private / Protected / user - admin
const deleteReview = handlerFactory.deleteOne(ReviewModel);

module.exports = {
    getReviews,
    getReviewById,
    addReview,
    updateReview,
    deleteReview
};