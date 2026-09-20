const express = require('express');
const productValidator = require('../utils/validators/productValidator');

const productController = require('../controllers/productController');

const router = express.Router();




router.route('/')
    .get(productController.getAllProducts)
    .post(productValidator.addNewProductValidator, productController.addProduct);

router.route('/:id')
    .get(productValidator.getProductValidator, productController.getProductById)
    .patch(productValidator.updateProductValidator, productController.updateProduct)
    .delete(productValidator.deleteProductValidator, productController.deleteProduct);

module.exports = router;

