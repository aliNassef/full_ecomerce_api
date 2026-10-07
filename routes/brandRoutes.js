const express = require('express');

const router = express.Router();
const brandController = require('../controllers/brandController');
const brandValidator = require('../utils/validators/brandValidator');
const authController = require('../controllers/authController');

router.route('/')
    .get(brandController.getBrands)
    .post(authController.authGate, authController.verifyTo('admin'), brandController.uploadBrandImage, brandController.resizeImage, brandValidator.addNewBrandValidator, brandController.addNewBrand);

router.route('/:id')
    .get(brandValidator.getBrandValidator, brandController.getBrand)
    .patch(authController.authGate, authController.verifyTo('admin'), brandController.uploadBrandImage, brandController.resizeImage, brandValidator.updateBrandValidator, brandController.updateBrand)
    .delete(authController.authGate, authController.verifyTo('admin'), brandValidator.deleteBrandValidator, brandController.deleteBrand);

module.exports = router;


