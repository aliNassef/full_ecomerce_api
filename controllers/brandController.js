const slugify = require('slugify');
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const BrandModel = require('../models/brandModel');

// @desc Get all brands
// @route GET /brands
// @access Public
const getBrands = asyncHandler(async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const brands = await BrandModel.find().skip(skip).limit(limit);

    res.status(200).send({
        message: 'Brands retrieved successfully',
        data: {
            brands
        }
    });
});

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