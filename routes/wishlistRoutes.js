const express = require('express');

const router = express.Router();

const wishlistController = require('../controllers/wishlistController');
const authController = require('../controllers/authController');
const wishlistValidator = require('../utils/validators/wishValidator');

router.use(authController.authGate,
    authController.verifyTo('user')
);

router.route('/')
    .post(

        wishlistValidator.wishlistValidator,
        wishlistController.addProductToWishlist
    ).get(

        wishlistController.getWishlist
    );

router.route('/:productId').delete(

    wishlistValidator.wishlistValidator,
    wishlistController.removeProductFromWishlist
);
module.exports = router;
