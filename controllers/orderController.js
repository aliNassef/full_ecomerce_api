/* eslint-disable import/no-extraneous-dependencies */
const stripe = require('stripe')(process.env.STRIPE_SECRET);
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


///  @desc  Change Order Status To Paid
///  @router Patch /api/v1/orders/:id/pay
///  @access Private / Admin
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
        return next(new ApiError('Order Not Found', 404));
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).send(
        {
            status: "success",
            message: "Order Updated Succesfully",
            data: updatedOrder
        }
    );
});


///  @desc  Change Order Status To Delivred
///  @router Patch /api/v1/orders/:id/delivred
///  @access Private / Admin
const updateOrderToDelivred = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
        return next(new ApiError('Order Not Found', 404));
    }
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).send(
        {
            status: "success",
            message: "Order Updated Succesfully",
            data: updatedOrder
        }
    );
});

/// @desc Get Session 
/// @router GET api/v1/orders/checkout-session/:cartId
/// access Private/User
const checkoutSession = asyncHandler(async (req, res, next) => {
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

    const { details, phone, city } = req.body.shippingAddress;

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{
            quantity: 1,
            price_data: {
                currency: 'egp',
                unit_amount: Math.round(totalOrderPrice * 100),
                product_data: { name: `Order #${req.params.cartId}` },
            },
        }],
        customer_email: req.user.email,
        client_reference_id: req.params.cartId,
        metadata: {
            details: String(details),
            phone: String(phone),
            city: String(city),
        },
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,

    });

    res.status(200).send({
        status: "success",
        session
    });

});

// Creates a paid card order from a completed checkout session (see checkoutSession above).
const createCardOrder = async (session) => {
    // async payment methods can complete checkout before the money arrives
    if (session.payment_status !== 'paid') return null;

    const cartId = session.client_reference_id;
    const { details, phone, city } = session.metadata;
    const totalOrderPrice = session.amount_total / 100;

    // the cart is deleted once its order exists, so a retried event finds nothing to do
    const cart = await CartModel.findById(cartId);
    if (!cart) return null;

    const order = await OrderModel.create({
        user: cart.user,
        cartItems: cart.cartItems,
        shippingAddress: { details, phone, city },
        totalOrderPrice,
        paymentMethodType: 'card',
        isPaid: true,
        paidAt: Date.now(),
    });

    const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
            filter: { _id: item.product },
            update: {
                $inc: {
                    sold: +item.quantity,
                    stock: -item.quantity
                },
            },
        },
    }));
    await ProductModel.bulkWrite(bulkOption);

    await CartModel.findByIdAndDelete(cartId);

    return order;
};

/// @desc   Stripe webhook: create the order once checkout is paid
/// @router POST /order-checkout
/// @access Public (verified by Stripe signature)
const orderCheckout = asyncHandler(async (req, res, next) => {
    const signature = req.headers['stripe-signature'];

    console.log('Create ORDER TEST -------------------------------------');

    let event;
    try {
        // req.body must be the raw Buffer from express.raw() in server.js, or the signature check fails
        event = stripe.parseEventNotification(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'v1.checkout.session.completed') {
        console.log('Create ORDER ------------------------------------- ');
        console.log(
            `${event.data}`
                `EVENT : ${event}`
        );

        await createCardOrder(event.fetchRelatedObject());
    }

    // anything but a 2xx makes Stripe retry the event
    res.status(200).json({ received: true });
});
module.exports = {
    createCashOrder,
    getOrders,
    getOrder,
    filterOrder,
    updateOrderToPaid,
    updateOrderToDelivred,
    checkoutSession,
    orderCheckout
};