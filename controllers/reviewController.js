const handlerFactory = require('./handlerFactory');
const ReviewModel = require('../models/reviewModel');


const setProductIdAndUserId = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.id;
    if (!req.body.user) req.body.user = req.user._id;
    next();
};

const createfilteredObject = (req, res, next) => {
    let filteredObject = {};
    if (req.params.id) filteredObject = { product: req.params.id };

    req.filteredObject = filteredObject;
    next();
};

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
    deleteReview,
    setProductIdAndUserId,
    createfilteredObject
};