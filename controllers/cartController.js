const asynchandler = require('express-async-handler');
const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');
const ApiError = require('../utils/apiError');

/// @desc Add product to cart
/// @route POST /api/v1/cart
/// @access Private/User
const addProductToCart = asynchandler(async (req, res) => {
    const { productId, color } = req.body;
    const product = await ProductModel.findById(productId);
    let cart = await CartModel.findOne({ user: req.user._id });
    if (!cart) {
        cart = await CartModel.create({
            user: req.user._id,
            cartItems: [{
                product: productId,
                quantity: 1,
                color: color,
                price: product.price
            }]
        });
    } else {
        const itemIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() === productId && item.color === color
        );

        if (itemIndex > -1) {
            cart.cartItems[itemIndex].quantity += 1;
        } else {
            cart.cartItems.push({
                product: productId,
                quantity: 1,
                color: color,
                price: product.price
            });
        }
    }
    // calculate total price
    cart.totalPrice = calculateTotalPrice(cart.cartItems);
    await cart.save();
    return res.status(200).send({
        status: 'success',
        message: 'Product added to cart successfully',
        data: cart
    });
});

/// @desc Get cart
/// @route GET /api/v1/cart
/// @access Private/User
const getCart = asynchandler(async (req, res, next) => {
    const userId = req.user._id;
    const cart = await CartModel.findOne({ user: userId }).populate('cartItems.product');
    if (!cart) {
        return next(new ApiError('Cart not found', 404));
    }
    return res.status(200).send({
        status: 'success',
        message: 'Cart retrieved successfully',
        data: {
            cartItems: cart.cartItems,
            totalPrice: cart.totalPrice,
            length: cart.cartItems.length
        }
    });
});

/// @desc Delete CartItem from cart
/// @route DELETE /api/v1/cart/:itemId
/// @access Private/User
const deleteCartItemFromCart = asynchandler(async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user._id;
    const cart = await CartModel.findOneAndUpdate({ user: userId }, { $pull: { cartItems: { _id: itemId } } }, { new: true });
    if (!cart) {
        return next(new ApiError('Cart not found', 404));
    }
    // calculate total price
    cart.totalPrice = calculateTotalPrice(cart.cartItems);
    await cart.save();
    return res.status(200).send({
        status: 'success',
        message: 'Cart item removed from cart successfully',
        data: cart
    });
});

/// @desc Update product quantity in cart
/// @route PUT /api/v1/cart/:productId
/// @access Private/User
const updateProductQuantityInCart = asynchandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
        return next(new ApiError('Cart not found', 404));
    }
    const itemIndex = cart.cartItems.findIndex(item => item._id.toString() === itemId);
    if (itemIndex > -1) {
        cart.cartItems[itemIndex].quantity = quantity;
    } else {
        return next(new ApiError('Cart Item not found in cart', 404));
    }
    // calculate total price
    cart.totalPrice = calculateTotalPrice(cart.cartItems);
    await cart.save();
    return res.status(200).send({
        status: 'success',
        message: 'Cart Item quantity updated in cart successfully',
        data: cart
    });
});

/// @desc clear cart items 
/// @route DELETE /api/v1/cart
/// @access Private/User
const clearCart = asynchandler(async (req, res, next) => {
    const cart = await CartModel.findOneAndDelete({ user: req.user._id });
    res.status(204).send();
});


const calculateTotalPrice = (cartItems) => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

module.exports = {
    addProductToCart,
    getCart,
    deleteCartItemFromCart,
    updateProductQuantityInCart,
    clearCart
};