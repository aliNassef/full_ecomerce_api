
const sharp = require('sharp');
const path = require('path');
const asyncHandler = require('express-async-handler');


const ProductModel = require('../models/productModel');

const handlerFactory = require('./handlerFactory');


const { uploadMixedImages } = require('../middlewares/uploadImageMiddleware');

const uploadPath = path.join(
    process.cwd(),
    'uploads',
    'products'
);

const uploadMixedImage = uploadMixedImages([
    {
        name: 'thumbnail',
        maxCount: 1,
    },
    {
        name: 'image',
        maxCount: 5,
    },
]);

const resizeImage = asyncHandler(async (req, res, next) => {
    console.log(req.files);

    if (req.files.thumbnail[0].buffer) {
        const fileName = `Product-${Date.now()}.jpeg`;
        await sharp(req.files.thumbnail[0].buffer)
            .resize({ width: 600, height: 600 })
            .jpeg({ mozjpeg: true }).toFile(path.join(uploadPath, fileName));
        req.body.thumbnail = fileName;
    }

    if (req.files.image) {
        const imaeges = [];
        await Promise.all(
            req.files.image.map(async (file) => {
                if (file.buffer) {
                    const fileName = `Product-${Date.now()}.jpeg`;
                    await sharp(file.buffer)
                        .resize({ width: 600, height: 600 })
                        .jpeg({ mozjpeg: true }).toFile(path.join(uploadPath, fileName));

                    imaeges.push(fileName);
                }
            }));
        req.body.image = imaeges;
    }
    next();
});

// @desc Get all products
// @route GET /api/V1/products
// @access Public
const getAllProducts = handlerFactory.getAll(ProductModel);



// @desc Get product by id
// @route GET /api/V1/products/:id
// @access Public
const getProductById = handlerFactory.getOne(ProductModel);


// @desc Add new product
// @route POST /api/V1/products
// @access Private
const addProduct = handlerFactory.createOne(ProductModel);
// @desc Update product
// @route PATCH /api/V1/products/:id
// @access Private
const updateProduct = handlerFactory.updateOne(ProductModel);
// @desc Delete product
// @route DELETE /api/V1/products/:id
// @access Private
const deleteProduct = handlerFactory.deleteOne(ProductModel);

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadMixedImage,
    resizeImage,
};