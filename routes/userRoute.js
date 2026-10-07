const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

const userValidator = require('../utils/validators/userValidator');

const authController = require('../controllers/authController');

router.patch(
    '/change-password/:id',
    userValidator.changePasswordValidator,
    userController.changePassword
);


router.route('/')
    .get(authController.authGate, authController.verifyTo('admin'), userController.getUsers)
    .post(authController.authGate, authController.verifyTo('admin'), userController.uploadUserImage, userController.resizeImage, userValidator.addNewUserValidator, userController.addUser);

router.route('/:id')
    .get(authController.authGate, authController.verifyTo('admin'), userValidator.getUserValidator, userController.getUserById)
    .patch(authController.authGate, authController.verifyTo('admin'), userController.uploadUserImage, userController.resizeImage, userValidator.updateUserValidator, userController.updateUser)
    .delete(authController.authGate, authController.verifyTo('admin'), userValidator.deleteUserValidator, userController.deleteUser);

module.exports = router;
