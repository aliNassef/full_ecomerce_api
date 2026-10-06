const path = require('path');
const sharp = require('sharp');

// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');

const asyncHandler = require('express-async-handler');
const handlerFactory = require('./handlerFactory');
const UserModel = require('../models/userModel');
const ApiError = require('../utils/apiError');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

const uploadPath = path.join(
    process.cwd(),
    'uploads',
    'users'
);

const uploadUserImage = uploadSingleImage('profileImage');

const resizeImage = asyncHandler(async (req, res, next) => {
    console.log(req.file);
    if (!req.file) {
        return next();
    }
    const fileName = `User-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize({ width: 600, height: 600 })
        .jpeg({ mozjpeg: true }).toFile(path.join(uploadPath, fileName));

    // save image name in db
    req.body.profileImage = fileName;
    next();
});


// @desc Get all users
// @route GET /api/V1/users
// @access Private
const getUsers = handlerFactory.getAll(UserModel);

// @desc Get user by id
// @route GET /api/V1/users/:id
// @access Private
const getUserById = handlerFactory.getOne(UserModel);

// @desc Add new user
// @route POST /api/V1/users
// @access Private
const addUser = handlerFactory.createOne(UserModel);

// @desc Update user
// @route PATCH /api/V1/users/:id
// @access Private
const updateUser = asyncHandler(async (req, res, next) => {

    const document = await UserModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        slug: req.body.slug,
        email: req.body.email,
        phone: req.body.phone,
        profileImage: req.body.profileImage,
        role: req.body.role,
    }, { new: true });
    if (!document) {
        return next(new ApiError(`document not found with id ${req.params.id}`, 404));
    }
    res.status(200).send({
        message: 'document updated successfully',
        data: {
            document
        }
    });
});

// @desc update user password
// @route PATCH /api/V1/users/:id/password
// @access Private
const changePassword = asyncHandler(async (req, res, next) => {

    const document = await UserModel.findByIdAndUpdate(req.params.id, {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChanged: Date.now(),
    }, { new: true });
    if (!document) {
        return next(new ApiError(`document not found with id ${req.params.id}`, 404));
    }

    res.status(200).send({
        message: 'document updated successfully',
        data: {
            document
        }
    });
});

// @desc Delete user
// @route DELETE /api/V1/users/:id
// @access Private
const deleteUser = handlerFactory.deleteOne(UserModel);

module.exports = {
    getUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeImage,
    changePassword
};



