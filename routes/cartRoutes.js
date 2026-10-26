const express = require('express');

const router = express.Router();
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');
const cartValidator = require('../utils/validators/cartValidator');

router.use(authController.authGate, authController.verifyTo('user'));

router.route('/')
    .post(cartValidator.addProductToCartValidator, cartController.addProductToCart)
    .get(cartController.getCart)
    .delete(cartController.clearCart);

router.route('/:itemId')
    .delete(cartValidator.deleteProductFromCartValidator, cartController.deleteCartItemFromCart)
    .patch(cartValidator.updateProductQuantityValidator, cartController.updateProductQuantityInCart);
module.exports = router;