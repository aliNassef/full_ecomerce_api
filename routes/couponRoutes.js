const express = require('express');

const router = express.Router();
const controller = require('../controllers/couponController');
const authController = require('../controllers/authController');

router.use(authController.authGate, authController.verifyTo('admin'));

router.route('/')
    .post(controller.addNewCoupon)
    .get(controller.getCoupons);

router.route('/:id')
    .get(controller.getCoupon)
    .patch(controller.updateCoupon)
    .delete(controller.deleteCoupon);

module.exports = router;