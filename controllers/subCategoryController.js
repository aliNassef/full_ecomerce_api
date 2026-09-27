const SubCategoryModel = require('../models/subCategoryModel');
const handlerFactory = require('./handlerFactory');

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
const addNewSubCategory = handlerFactory.createOne(SubCategoryModel);

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
const getSubCategories = handlerFactory.getAll(SubCategoryModel);

// @desc Get a single subcategory by id
// @route GET /categories/:categoryId/subcategories/:id
// @access Public
const getSubCategory = handlerFactory.getOne(SubCategoryModel);

// @desc Update a subcategory
// @route PATCH /categories/:categoryId/subcategories/:id
// @access Public
const updateSubCategory = handlerFactory.updateOne(SubCategoryModel);

// @desc Delete a subcategory
// @route DELETE /categories/:categoryId/subcategories/:id
// @access Public
const deleteSubCategory = handlerFactory.deleteOne(SubCategoryModel);



module.exports = {
    addNewSubCategory,
    getSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    setCategoryId,
    createfilteredObject
};
