const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

const categoryValidator = require('../utils/validators/categoryValidator');

router.route('/')
    .post(categoryValidator.addCategoryValidator, categoryController.addCategory)
    .get(categoryController.getCategories);

router.route('/:id')
    .get(categoryValidator.getCategoryByIdValidator, categoryController.getCategory)
    .patch(categoryValidator.updateCategoryValidator, categoryController.updateCategory)
    .delete(categoryValidator.deleteCategoryValidator, categoryController.deleteCategory);



module.exports = router;  