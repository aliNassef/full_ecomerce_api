const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

const userValidator = require('../utils/validators/userValidator');

const authController = require('../controllers/authController');


router.use(authController.authGate);
router.get('/my-profile', userController.getMyProfile, userController.getUserById);
router.patch('/updateLoggedUserPassword', userController.updateLoggedUserPassword);
router.patch('/updateMe', userValidator.updateUserLoggedValidator, userController.updateLoggedUserData);
router.delete('/deleteMe', userController.deactivateUser);


router.use(authController.verifyTo('admin'));

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
