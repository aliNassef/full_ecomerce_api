const express = require('express');
const productValidator = require('../utils/validators/productValidator');

const productController = require('../controllers/productController');

const router = express.Router();

const authController = require('../controllers/authController');


router.route('/')
    .get(productController.getAllProducts)
    .post(authController.authGate, authController.verifyTo('admin'), productController.uploadMixedImage, productController.resizeImage, productValidator.addNewProductValidator, productController.addProduct);

router.route('/:id')
    .get(productValidator.getProductValidator, productController.getProductById)
    .patch(authController.authGate, authController.verifyTo('admin'), productController.uploadMixedImage, productController.resizeImage, productValidator.updateProductValidator, productController.updateProduct)
    .delete(authController.authGate, authController.verifyTo('admin'), productValidator.deleteProductValidator, productController.deleteProduct);

module.exports = router;

