const mongoose = require('mongoose');
const ProductModel = require('./productModel');

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


reviewSchema.static('calculateAverageRating', async function (productId) {
    const result = await this.aggregate([
        {
            $match: {
                product: productId,
            },
        },
        {
            $group: {
                _id: null,
                ratingCount: { $sum: 1 },
                ratingsAverage: { $avg: '$rating' },
            },
        },
    ]);
    if (!result.length) {
        return {
            ratingCount: 0,
            ratingsAverage: 0,
        };
    }
    return {
        ratingCount: result[0].ratingCount,
        ratingsAverage: result[0].ratingsAverage,
    };
});

reviewSchema.static('updateProductRating', async function (productId) {
    const { ratingCount, ratingsAverage } =
        await this.calculateAverageRating(productId);

    await ProductModel.findByIdAndUpdate(productId, {
        ratingCount,
        rating: ratingsAverage,
    });
});

reviewSchema.post('save', async function () {
    await this.constructor.updateProductRating(this.product);
});

// query middleware: `this` is the Query, the updated review is passed as `doc`
reviewSchema.post('findOneAndUpdate', async (doc) => {
    if (doc) await doc.constructor.updateProductRating(doc.product);
});

// document.deleteOne() (handlerFactory.deleteOne) is document middleware
reviewSchema.post('deleteOne', { document: true, query: false }, async function () {
    await this.constructor.updateProductRating(this.product);
});


module.exports = mongoose.model('Review', reviewSchema);