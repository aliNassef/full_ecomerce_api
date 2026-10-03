// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');

const path = require('path');
const handlerFactory = require('./handlerFactory');
const CategoryModel = require('../models/categoryModel');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

const uploadPath = path.join(
    process.cwd(),
    'uploads',
    'categories'
);


const uploadCategoryImage = uploadSingleImage('image');


const resizeImage = asyncHandler(async (req, res, next) => {
    console.log(req.file);
    if (!req.file) {
        return next();
    }
    const fileName = `Category-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize({ width: 600, height: 600 })
        .jpeg({ mozjpeg: true }).toFile(path.join(uploadPath, fileName));

    // save image name in db
    req.body.image = fileName;
    next();

});

// @desc Add a new category
// @route POST /categories
// @access Public
const addCategory = handlerFactory.createOne(CategoryModel);

// @desc Get all categories
// @route GET /categories
// @access Public
const getCategories = handlerFactory.getAll(CategoryModel, ['name']);

// @desc Get a single category by id
// @route GET /categories/:id
// @access Public
const getCategory = handlerFactory.getOne(CategoryModel);
// @desc Update a category
// @route PATCH /categories/:id
// @access Public
const updateCategory = handlerFactory.updateOne(CategoryModel);

// @desc Delete a category
// @route DELETE /categories/:id
// @access Public
const deleteCategory = handlerFactory.deleteOne(CategoryModel);



module.exports = { getCategories, addCategory, getCategory, updateCategory, deleteCategory, uploadCategoryImage, resizeImage };