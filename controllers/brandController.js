const slugify = require('slugify');
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const BrandModel = require('../models/brandModel');
const ApiFeature = require('../utils/apiFeature');

// @desc Get all brands
// @route GET /brands
// @access Public
const getBrands = asyncHandler(async (req, res, next) => {
    const documentCount = await BrandModel.countDocuments();
    const apiFeature = new ApiFeature(BrandModel.find(), req.query)
        .filter()
        .search(['name'])
        .sort()
        .limitFields()
        .paginate(documentCount)

    const { paginationResult, mongooseQuery } = apiFeature;
    const brands = await mongooseQuery;

    res.status(200).send({
        message: 'Brands retrieved successfully',
        paginationResult,
        length: brands.length,
        data: {
            brands
        }
    });
});

// @desc Get a single brand by id
// @route GET /brands/:id
// @access Public
const getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await BrandModel.findById(id);
    if (!brand) {
        return next(new ApiError(`Brand not found with id ${id}`, 404));
    }
    res.status(200).send({
        message: 'Brand retrieved successfully',
        data: {
            brand
        }
    });
});

// @desc Update a brand
// @route PATCH /brands/:id
// @access Public
const updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const brand = await BrandModel.findByIdAndUpdate(id, { name, slug: slugify(name, { lower: true }) }, { new: true });
    if (!brand) {
        return next(new ApiError(`Brand not found with id ${id}`, 404));
    }

    res.status(200).send({
        message: 'Brand updated successfully',
        data: {
            brand
        }
    });
});

// @desc Delete a brand
// @route DELETE /brands/:id
// @access Public
const deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await BrandModel.findById(id);
    if (!brand) {
        return next(new ApiError(`Brand not found with id ${id}`, 404));
    }
    await brand.deleteOne();
    res.status(204).send({
        message: 'Brand deleted successfully',
    });
});

// @desc Create a new brand
// @route POST /brands
// @access Public
const addNewBrand = asyncHandler(
    async (req, res, next) => {
        const { name } = req.body;
        const slug = slugify(name, { lower: true });
        const brand = new BrandModel({
            name,
            slug,
        });

        await brand.save();
        res.status(201).send({
            message: 'Brand added successfully',
            data: {
                brand
            }
        },);
    }
);

module.exports = {
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand,
    addNewBrand
};