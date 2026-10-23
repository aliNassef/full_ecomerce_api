const express = require('express');

const router = express.Router();
const addressController = require('../controllers/addressController');
const authController = require('../controllers/authController');


router.use(
    authController.authGate,
    authController.verifyTo('user')
);

router.route('/')
    .get(addressController.getAddress)
    .post(addressController.addAddress);

router.route('/:addressId')
    .delete(addressController.deleteAddress);

module.exports = router;
