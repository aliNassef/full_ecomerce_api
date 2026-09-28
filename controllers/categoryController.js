const multer = require('multer');
const path = require('path');
const handlerFactory = require('./handlerFactory');
const CategoryModel = require('../models/categoryModel');

const ApiError = require('../utils/apiError');

const uploadPath = path.join(
    process.cwd(),
    'uploads',
    'categories'
);
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `Category-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
});

const nulterFilter = (req, file, cb) => {

    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new ApiError('Only image files are allowed!'), false);
    }

};
const upload = multer({ storage: multerStorage, fileFilter: nulterFilter });


const uploadCategoryImage = upload.single('image');




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



module.exports = { getCategories, addCategory, getCategory, updateCategory, deleteCategory, uploadCategoryImage };