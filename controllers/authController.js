/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

const UserModel = require('../models/userModel');

const ApiError = require('../utils/apiError');

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
// @access Private

const authGate = asyncHandler(async (req, res, next) => {

    let token = req.headers.authorization;
    token = token.split(' ')[1];
    console.log(token);
    if (!token) {
        return next(new ApiError('Unauthorized , Please login first then try again', 401));
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    const user = await UserModel.findById(decode.id);
    if (!user) {
        return next(new ApiError('Unauthorized , Please login first then try again', 401));
    }


});

module.exports = {
    signup,
    login,
    authGate
};