const express = require('express');

const router = express.Router({ mergeParams: true });

const subCategoryController = require('../controllers/subCategoryController');

const subCategoryValidator = require('../utils/validators/subCategoryValidator');

const authController = require('../controllers/authController');

router.route('/')
    .get(subCategoryController.createfilteredObject, subCategoryController.getSubCategories)
    .post(authController.authGate, authController.verifyTo('admin'), subCategoryController.setCategoryId, subCategoryValidator.addSubCategoryValidator, subCategoryController.addNewSubCategory);

router.route('/:id')
    .get(subCategoryValidator.getSubCategoryyByIdValidator, subCategoryController.getSubCategory)
    .patch(authController.authGate, authController.verifyTo('admin'), subCategoryValidator.updateSubCategoryValidator, subCategoryController.updateSubCategory)
    .delete(authController.authGate, authController.verifyTo('admin'), subCategoryValidator.deleteSubCategoryValidator, subCategoryController.deleteSubCategory);


module.exports = router;
