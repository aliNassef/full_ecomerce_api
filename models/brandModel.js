const mongoose = require('mongoose');



const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        unique: [true, 'Brand name must be unique'],
        trim: true,
        minlength: [2, 'Brand name must be at least 3 characters'],
        maxlength: [32, 'Brand name must be less than 32 characters'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: {
        type: String,
    }
});


module.exports = mongoose.model('brand', brandSchema);