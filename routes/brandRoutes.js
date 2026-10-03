const express = require('express');

const router = express.Router();
const brandController = require('../controllers/brandController');
const brandValidator = require('../utils/validators/brandValidator');

router.route('/')
    .get(brandController.getBrands)
    .post(brandController.uploadBrandImage, brandController.resizeImage, brandValidator.addNewBrandValidator, brandController.addNewBrand);

router.route('/:id')
    .get(brandValidator.getBrandValidator, brandController.getBrand)
    .patch(brandController.uploadBrandImage, brandController.resizeImage, brandValidator.updateBrandValidator, brandController.updateBrand)
    .delete(brandValidator.deleteBrandValidator, brandController.deleteBrand);

module.exports = router;


