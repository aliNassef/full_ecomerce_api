const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: [100, 'Name is too long'],
        minlength: [3, 'Name is too short']
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        minlength: [20, 'Description is too short'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
    },
    thumbnail: {
        type: String,
        required: true,
    },
    priceAfterDiscount: {
        type: Number,
        trim: true,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand',
    },
    subcategory: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'SubCategory',
    },
    image: {
        type: [String],
    },
    sold: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be greater than 1'],
        max: [5, 'Rating must be less than 5'],
    },
    ratingCount: {
        type: Number,
        default: 0,
    },
    colors: {
        type: [String],
    },
}, { timestamps: true });



module.exports = mongoose.model('Product', productSchema);