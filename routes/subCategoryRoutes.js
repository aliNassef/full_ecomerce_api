const express = require('express');

const router = express.Router({ mergeParams: true });

const subCategoryController = require('../controllers/subCategoryController');

const subCategoryValidator = require('../utils/validators/subCategoryValidator');


router.route('/')
    .get(subCategoryController.createfilteredObject, subCategoryController.getSubCategories)
    .post(subCategoryController.setCategoryId, subCategoryValidator.addSubCategoryValidator, subCategoryController.addNewSubCategory);

router.route('/:id')
    .get(subCategoryValidator.getSubCategoryyByIdValidator, subCategoryController.getSubCategory)
    .patch(subCategoryValidator.updateSubCategoryValidator, subCategoryController.updateSubCategory)
    .delete(subCategoryValidator.deleteSubCategoryValidator, subCategoryController.deleteSubCategory);


module.exports = router;
