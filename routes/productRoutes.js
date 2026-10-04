const express = require('express');
const productValidator = require('../utils/validators/productValidator');

const productController = require('../controllers/productController');

const router = express.Router();




router.route('/')
    .get(productController.getAllProducts)
    .post(productController.uploadMixedImage, productController.resizeImage, productValidator.addNewProductValidator, productController.addProduct);

router.route('/:id')
    .get(productValidator.getProductValidator, productController.getProductById)
    .patch(productController.uploadMixedImage, productController.resizeImage, productValidator.updateProductValidator, productController.updateProduct)
    .delete(productValidator.deleteProductValidator, productController.deleteProduct);

module.exports = router;

