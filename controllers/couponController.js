const handlerFactory = require('./handlerFactory');
const CouponModel = require('../models/couponModel');


// @desc Add a new coupon
// @route POST /coupons
// @access Private / admin
const addNewCoupon = handlerFactory.createOne(CouponModel);

// @desc Get all coupons
// @route GET /coupons
// @access Private / admin
const getCoupons = handlerFactory.getAll(CouponModel);

// @desc Get a single coupon by id
// @route GET /coupons/:id
// @access Private / admin
const getCoupon = handlerFactory.getOne(CouponModel);

// @desc Update a coupon
// @route PATCH /coupons/:id
// @access Private / admin
const updateCoupon = handlerFactory.updateOne(CouponModel);

// @desc Delete a coupon
// @route DELETE /coupons/:id
// @access Private / admin
const deleteCoupon = handlerFactory.deleteOne(CouponModel);

module.exports = {
    addNewCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon
};