const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    discount: {
        type: Number,
        required: [true, 'Please provide discount']
    },
    expiryDate: {
        type: Date,
        required: [true, 'Please provide expiry date']
    },

}, {
    timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);