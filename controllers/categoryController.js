const categoryModel = require('../models/categoryModel');
const slugify = require('slugify')
const asyncHandler = require('express-async-handler');


const addCategory = asyncHandler(async (req, res, next) => {
    const { name, image } = req.body;
    const slugifiedName = slugify(name, { lower: true });
    const category = new categoryModel({
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
    const categories = await categoryModel.find().skip(skip).limit(limit);
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
    const category = await categoryModel.findById(id);
    if (!category) {
        return res.status(404).send({
            message: 'Category not found',
            data: null
        });
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
    const category = await categoryModel.findById(id);
    if (!category) {
        return res.status(404).send({
            message: 'Category not found',
            data: null
        });
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
    const category = await categoryModel.findById(id);
    if (!category) {
        return res.status(404).send({
            message: 'Category not found',
            data: null
        });
    }
    await category.deleteOne();
    res.status(204).send({
        message: 'Category deleted successfully',
    });
});



module.exports = { getCategories, addCategory, getCategory, updateCategory, deleteCategory };