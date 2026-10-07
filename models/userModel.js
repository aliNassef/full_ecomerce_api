// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name is too short'],
        maxlength: [32, 'Name is too long'],
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,

    },
    phone: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password is too short'],
        trim: true,
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: ['admin', 'user'],
        default: 'user',
    },
    passwordChangedAt: Date,
}, {
    timestamps: true,
});


userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);


});

module.exports = mongoose.model('User', userSchema);



