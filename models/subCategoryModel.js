const mongoose = require('mongoose');


const SubCategoryModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'Unique sub category name is required'],
        trim: true,
        minlength: [2, 'too short sub category name'],
        maxlength: [32, 'too long sub category name']
    },
    slug: {
        type: String,
        lowercase: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true,
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('SubCategory', SubCategoryModel);