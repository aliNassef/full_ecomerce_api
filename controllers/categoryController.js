const asyncHandler = require('express-async-handler');

const slugify = require('slugify')

const CategoryModel = require('../models/categoryModel');

const ApiError = require('../utils/apiError');

const addCategory = asyncHandler(async (req, res, next) => {
    const { name, image } = req.body;
    const slugifiedName = slugify(name, { lower: true });
    const category = new CategoryModel({
        name,
        slug: slugifiedName,
    });

    await category.save();
    res.status(201).send({
        message: 'Category added successfully',
        data: {
            category
        }
    });
});

const getCategories = asyncHandler(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const categories = await CategoryModel.find().skip(skip).limit(limit);
    console.log(categories);
    res.status(200).send({
        message: 'Categories retrieved successfully',
        data: {
            categories
        }
    },);
});


const getCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);
    if (!category) {
        next(new ApiError(`Category not found with id ${id}`, 404));
        return;
    }
    res.status(200).send({
        message: 'Category retrieved successfully',
        data: {
            category
        }
    });
});


const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await CategoryModel.findById(id);
    if (!category) {
        next(new ApiError(`Category not found `, 404));
        return;
    }

    category.name = name;
    category.slug = slugify(name, { lower: true });
    await category.save();
    res.status(200).send({
        message: 'Category updated successfully',
        data: {
            category
        }
    });
});



const deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);
    if (!category) {

        next(new ApiError(`Category not found with id ${id}`, 404));
        return;
    }
    await category.deleteOne();
    res.status(204).send({
        message: 'Category deleted successfully',
    });
});



module.exports = { getCategories, addCategory, getCategory, updateCategory, deleteCategory };