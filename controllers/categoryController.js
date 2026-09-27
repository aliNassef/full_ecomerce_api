const asyncHandler = require('express-async-handler');


const CategoryModel = require('../models/categoryModel');

const ApiFeature = require('../utils/apiFeature');

const handlerFactory = require('./handlerFactory');


// @desc Add a new category
// @route POST /categories
// @access Public
const addCategory = handlerFactory.createOne(CategoryModel);

// @desc Get all categories
// @route GET /categories
// @access Public
const getCategories = handlerFactory.getAll(CategoryModel, ['name']);

// @desc Get a single category by id
// @route GET /categories/:id
// @access Public
const getCategory = handlerFactory.getOne(CategoryModel);
// @desc Update a category
// @route PATCH /categories/:id
// @access Public
const updateCategory = handlerFactory.updateOne(CategoryModel);

// @desc Delete a category
// @route DELETE /categories/:id
// @access Public
const deleteCategory = handlerFactory.deleteOne(CategoryModel);



module.exports = { getCategories, addCategory, getCategory, updateCategory, deleteCategory };