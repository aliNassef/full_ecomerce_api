/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const crypto = require('crypto');
const UserModel = require('../models/userModel');

const ApiError = require('../utils/apiError');

const sendEmail = require('../utils/emailSender');

const generateToken = (payload) =>
    jwt.sign({ id: payload }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

// @desc Signup 
// @route Post /auth/signup
// @access Public
const signup = asyncHandler(async (req, res) => {

    const user = await UserModel.create(
        {
            name: req.body.name,
            slug: slugify(req.body.name || '', { lower: true }),
            email: req.body.email,
            password: req.body.password,
        }
    );

    const token = generateToken(user._id);
    const userObject = user.toObject();
    delete userObject.password;
    res.status(201).send({
        token,
        data: { user: userObject },
    });

});


// @desc Login
// @route Post /auth/login
// @access Public
const login = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findOne({ email: req.body.email, },);


    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch || !user) {
        return next(new ApiError('Invalid credentials',
            401,
        ));
    }

    const token = generateToken(user._id);
    const userObject = user.toObject();
    delete userObject.password;

    res.status(200).send({
        token,
        data: { user: userObject },
    });
});


// @desc  verify user logged in
// @access Public

const authGate = asyncHandler(async (req, res, next) => {
    // check if token exist in req
    let token = req.headers.authorization;
    token = token.split(' ')[1];

    if (!token) {
        return next(new ApiError('Unauthorized , Please login first then try again', 401));
    }
    // verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // check if user exist in db
    const user = await UserModel.findById(decode.id);

    if (!user) {
        return next(new ApiError('Unauthorized , Please login first then try again', 401));
    }

    if (user.passwordChangedAt) {
        const passChangedTime = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
        if (passChangedTime > decode.iat) {
            return next(new ApiError('Unauthorized , Please login first then try again', 401));
        }
    }

    req.user = user;
    next();
});

// @desc  verify user access role 
const verifyTo = (...roles) => asyncHandler(async (req, res, next) => {

    if (!roles.includes(req.user.role)) {
        return next(new ApiError('not allowed to access this route', 403));
    }

    next();
});


// @desc  Forget password - send a 6-digit reset code to the user's email
// @route Post /auth/forgetPassword
// @access Public
const forgetPassword = asyncHandler(async (req, res, next) => {

    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        return next(new ApiError(`User not found with this email ${email}`, 404));
    }

    // generate a 6-digit code, store only its hash in db (valid for 10 min)
    const resetCode = crypto.randomInt(100000, 1000000).toString();
    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
    user.resetPasswordCode = hashedResetCode;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    user.resetPasswordVerification = false;
    await user.save();

    try {
        await sendEmail({
            to: user.email,
            subject: `E-SHOP - <${process.env.EMAIL_FROM}>`,
            // text: `Hi ${user.name},\nYour password reset code is: ${resetCode}\nThis code expires in 10 minutes.`,
            html: `
        <h2>Hi ${user.name},</h2>
        <p>Your password reset code is:</p>
        <h1>${resetCode}</h1>
        <p>This code expires in 10 minutes.</p>`,
        });
    } catch (error) {
        console.error('Error sending reset code email:', error);
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;
        user.resetPasswordVerification = undefined;
        await user.save();
        return next(new ApiError(`There was an error sending the email, please try again later ${error.message}`, 500));
    }

    res.status(200).send({
        message: 'Reset code sent to your email',
    });
});

module.exports = {
    signup,
    login,
    authGate,
    verifyTo,
    forgetPassword
};