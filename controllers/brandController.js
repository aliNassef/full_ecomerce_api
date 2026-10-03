/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const BrandModel = require('../models/brandModel');
const handlerFactory = require('./handlerFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

const uploadPath = path.join(
    process.cwd(),
    'uploads',
    'brands'
);

const uploadBrandImage = uploadSingleImage('image');


const resizeImage = asyncHandler(async (req, res, next) => {
    console.log(req.file);
    if (!req.file) {
        return next();
    }
    const fileName = `Brand-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize({ width: 600, height: 600 })
        .jpeg({ mozjpeg: true }).toFile(path.join(uploadPath, fileName));

    // save image name in db
    req.body.image = fileName;
    next();

});

// @desc Get all brands
// @route GET /brands
// @access Public
const getBrands = handlerFactory.getAll(BrandModel, ['name']);

// @desc Get a single brand by id
// @route GET /brands/:id
// @access Public
const getBrand = handlerFactory.getOne(BrandModel);

// @desc Update a brand
// @route PATCH /brands/:id
// @access Public
const updateBrand = handlerFactory.updateOne(BrandModel);
// @desc Delete a brand
// @route DELETE /brands/:id
// @access Public
const deleteBrand = handlerFactory.deleteOne(BrandModel);

// @desc Create a new brand
// @route POST /brands
// @access Public
const addNewBrand = handlerFactory.createOne(BrandModel);
module.exports = {
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand,
    addNewBrand,
    uploadBrandImage,
    resizeImage
};