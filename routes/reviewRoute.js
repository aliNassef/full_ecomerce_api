const express = require('express');

const router = express.Router(
    {
        mergeParams: true
    }
);
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const reviewValidator = require('../utils/validators/reviewValidator');


router.route('/')
    .get(reviewController.createfilteredObject, reviewController.getReviews)
    .post(authController.authGate, authController.verifyTo('user'), reviewController.setProductIdAndUserId, reviewValidator.addreviewValidator, reviewController.addReview);

router.route('/:id')
    .get(reviewValidator.getReviewById, reviewController.getReviewById)
    .patch(authController.authGate, authController.verifyTo('user'), reviewValidator.updatereviewValidator, reviewController.updateReview)
    .delete(authController.authGate, authController.verifyTo('admin', 'user'), reviewValidator.deletereviewValidator, reviewController.deleteReview);

module.exports = router;