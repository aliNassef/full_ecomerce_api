const asyncHandler = require("express-async-handler");

const slugify = require('slugify');
const ApiError = require("../utils/apiError");

const SubCategoryModel = require('../models/subCategoryModel');

const ApiFeature = require('../utils/apiFeature');

// @desc Middleware to attach categoryId from params to request body when missing
// @middleware
const setCategoryId = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
}

// @desc Add a new subcategory
// @route POST /categories/:categoryId/subcategories
// @access Public
// if category not in body but that in params.
const addNewSubCategory = asyncHandler(
    async (req, res, next) => {
        const { name, category } = req.body;
        const slug = slugify(name, { lower: true });
        const subCategory = new SubCategoryModel({
            name,
            slug,
            category,
        });

        await subCategory.save();
        res.status(201).send({
            message: 'Sub category added successfully',
            data: {
                subCategory
            }
        },);
    }
);

// @desc Middleware to filter subcategories by category id when present in params
// @middleware
const createfilteredObject = (req, res, next) => {
    let filteredObject = {};
    if (req.params.categoryId) filteredObject = { category: req.params.categoryId };

    req.filteredObject = filteredObject;
    next();
};

// @desc Get all subcategories for a category
// @route GET /categories/:categoryId/subcategories
// @access Public
const getSubCategories = asyncHandler(async (req, res, next) => {
    const documentCount = await SubCategoryModel.countDocuments();
    const apiFeature = new ApiFeature(SubCategoryModel.find(), req.query)
        .filter()
        .search()
        .sort()
        .limitFields()
        .paginate(documentCount);

    const { paginationResult, mongooseQuery } = apiFeature;
    const subCategories = await mongooseQuery;

    res.status(200).send({
        message: 'Sub categories retrieved successfully',
        paginationResult,
        length: subCategories.length,
        data: {
            subCategories
        }
    });
});

// @desc Get a single subcategory by id
// @route GET /categories/:categoryId/subcategories/:id
// @access Public
const getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await SubCategoryModel.findById(id);
    if (!subCategory) {
        return next(new ApiError(`Sub category not found with id ${id}`, 404));

    }
    res.status(200).send({
        message: 'Sub category retrieved successfully',
        data: {
            subCategory
        }
    });
});

// @desc Update a subcategory
// @route PATCH /categories/:categoryId/subcategories/:id
// @access Public
const updateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const { category } = req.body;
    const subCategory = await SubCategoryModel.findById(id);
    if (!subCategory) {
        return next(new ApiError(`Sub category not found with id ${id}`, 404));
    }

    subCategory.name = name;
    subCategory.category = category;
    subCategory.slug = slugify(name, { lower: true });
    await subCategory.updateOne();
    res.status(200).send({
        message: 'Sub category updated successfully',
        data: {
            subCategory
        }
    });
});

// @desc Delete a subcategory
// @route DELETE /categories/:categoryId/subcategories/:id
// @access Public
const deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await SubCategoryModel.findById(id);
    if (!subCategory) {
        return next(new ApiError(`Sub category not found with id ${id}`, 404));
    }
    await subCategory.deleteOne();
    res.status(204).send({
        message: 'Sub category deleted successfully',
    });
});



module.exports = {
    addNewSubCategory,
    getSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    setCategoryId,
    createfilteredObject
};
