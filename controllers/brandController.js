const BrandModel = require('../models/brandModel');
const handlerFactory = require('./handlerFactory');

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
    addNewBrand
};