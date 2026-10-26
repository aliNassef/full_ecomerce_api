const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
            color: String,
            price: {
                type: Number,
            }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0,
    },
    totalPriceAfterDiscount: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
});


module.exports = mongoose.model('Cart', CartSchema);