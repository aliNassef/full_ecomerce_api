const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

const userValidator = require('../utils/validators/userValidator');

const authController = require('../controllers/authController');

router.get('/my-profile', authController.authGate, userController.getMyProfile, userController.getUserById);
router.patch('/updateLoggedUserPassword', authController.authGate, userController.updateLoggedUserPassword);


router.use(authController.authGate, authController.verifyTo('admin'));

router.patch(
    '/change-password/:id',
    userValidator.changePasswordValidator,
    userController.changePassword
);

router.route('/')
    .get(userController.getUsers)
    .post(userController.uploadUserImage, userController.resizeImage, userValidator.addNewUserValidator, userController.addUser);

router.route('/:id')
    .get(userValidator.getUserValidator, userController.getUserById)
    .patch(userController.uploadUserImage, userController.resizeImage, userValidator.updateUserValidator, userController.updateUser)
    .delete(userValidator.deleteUserValidator, userController.deleteUser);

module.exports = router;
