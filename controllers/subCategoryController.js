const asyncHandler = require("express-async-handler");

const slugify = require('slugify');
const ApiError = require("../utils/apiError");

const SubCategoryModel = require('../models/subCategoryModel');

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

const getSubCategories = asyncHandler(async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const subCategories = await SubCategoryModel.find().skip(skip).limit(limit);

    res.status(200).send({
        message: 'Sub categories retrieved successfully',
        data: {
            subCategories
        }
    });
});


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
    await subCategory.save();
    res.status(200).send({
        message: 'Sub category updated successfully',
        data: {
            subCategory
        }
    });
});


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
};
