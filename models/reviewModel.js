const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be greater than 1'],
        max: [5, 'Rating must be less than 5'],
        required: [true, 'Rating must be provided to review'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User must be provided to review'],
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product must be provided to review'],
    },
}, {
    timestamps: true
});

reviewSchema.pre(/^find/, function () {
    this.populate('user', 'name');
});


module.exports = mongoose.model('Review', reviewSchema);