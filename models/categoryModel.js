const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'category name is required'],
        unique: [true, 'category name must be unique'],
        trim: true,
        minlength: [3, 'category name must be at least 3 characters'],
        maxlength: [32, 'category name must be less than 32 characters'],
    },

    slug: {
        type: String,
        lowercase: true,
    },
    image: {
        type: String,
    }

}, {
    timestamps: true,
});

const categoryModel = mongoose.model('category', categorySchema);

module.exports = categoryModel;