const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const OrderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');
const CartModel = require('../models/cartModel');
const handlerFactory = require('./handlerFactory');

/// @desc   createCashOrder 
/// @route  POST /api/v1/orders/cartId
/// @access Private / User 
const createCashOrder = asyncHandler(async (req, res, next) => {
    const shippingPrice = 0;
    const taxPrice = 0;

    // 1) Get Cart depend on CartId 
    const cart = await CartModel.findById(req.params.cartId);
    if (!cart) {
        return next(new ApiError('Cart Not Found', 404));
    }

    // 2) Get OrderPrice depend on cart price 
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    // 3) create Order With Default PaymentMethod   (CASH)
    const order = await OrderModel.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        totalOrderPrice,
        shippingAddress: req.body.shippingAddress,
    });
    await order.save();
    // 4) Update Product Stock  
    if (order) {
        const bulkOption = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product._id },
                update: {
                    $inc: {
                        sold: +item.quantity,
                        stock: -item.quantity
                    },
                },
            },
        }));

        await ProductModel.bulkWrite(bulkOption);
    }

    // 5) Clear Cart 
    await CartModel.deleteOne({
        _id: cart._id,
        user: req.user._id,
    });

    // response 
    res.status(201).send({
        status: "success",
        message: "Order Created Successfully",
        data: order,
    });
});


// users only see their own orders, admins see all
const filterOrder = (req, res, next) => {
    if (req.user.role === 'user') req.filteredObject = { user: req.user._id };
    next();
};

///  @desc Get All Orders
///  @router GET /api/v1/orders
///  @access Private / User, Admin
const getOrders = handlerFactory.getAll(OrderModel)



///  @desc Get Specific Order
///  @router GET /api/v1/orders/:id
///  @access Private / User
const getOrder = handlerFactory.getOne(OrderModel)


module.exports = {
    createCashOrder,
    getOrders,
    getOrder,
    filterOrder
};