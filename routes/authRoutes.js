const express = require('express');
const authController = require('../controllers/authController');
const authValidator = require('../utils/validators/authValidator');


const router = express.Router();


router.post('/signup', authValidator.signupValidator, authController.signup);
router.post('/login', authValidator.loginValidator, authController.login);
router.post('/forgetPassword', authValidator.forgetPasswordValidator, authController.forgetPassword);
router.post('/verifyResetPasswordCode', authValidator.verifyResetPasswordCode, authController.verifyResetPasswordCode);
router.patch('/resetPassword', authValidator.verifyResetPasswordCode, authController.resetPassword);

module.exports = router;