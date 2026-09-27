const ProductModel = require('../models/productModel');

const handlerFactory = require('./handlerFactory');

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
};