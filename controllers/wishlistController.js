const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');


// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private/protected
const addProductToWishlist = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: req.body.productId } }, { new: true });

    res.status(200).json({
        status: 'success',
        message: 'Product added to wishlist',
        data: {
            products: user.wishlist,
        },
    });

});


// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private/protected
const removeProductFromWishlist = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, { $pull: { wishlist: req.params.productId } }, { new: true });
    res.status(200).send({
        status: 'success',
        message: 'Product removed from wishlist',
        data: {
            products: user.wishlist,
        },
    });
});


// @desc    Get wishlist
// @route   GET /api/wishlist
// @access  Private/protected
const getWishlist = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id).populate('wishlist');
    res.status(200).send({
        status: 'success',
        message: 'Wishlist fetched successfully',
        data: {
            products: user.wishlist,
        },
    });
});

module.exports = {
    addProductToWishlist,
    removeProductFromWishlist,
    getWishlist
};