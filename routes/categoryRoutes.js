const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

const categoryValidator = require('../utils/validators/categoryValidator');

const subCategoryRouter = require('./subCategoryRoutes');

const authController = require('../controllers/authController');

router.use('/:categoryId/subCategory', subCategoryRouter);


router.route('/')
    .post(
        authController.authGate, authController.verifyTo('admin', 'manager'), categoryController.uploadCategoryImage, categoryController.resizeImage, categoryValidator.addCategoryValidator, categoryController.addCategory)
    .get(categoryController.getCategories);

router.route('/:id')
    .get(categoryValidator.getCategoryByIdValidator, categoryController.getCategory)
    .patch(authController.authGate, authController.verifyTo('admin', 'manager'), categoryController.uploadCategoryImage, categoryController.resizeImage, categoryValidator.updateCategoryValidator, categoryController.updateCategory)
    .delete(authController.authGate, authController.verifyTo('admin', 'manager'), categoryValidator.deleteCategoryValidator, categoryController.deleteCategory);



module.exports = router;  