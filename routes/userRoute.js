const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

const userValidator = require('../utils/validators/userValidator');



router.route('/')
    .get(userController.getUsers)
    .post(userController.uploadUserImage, userController.resizeImage, userValidator.addNewUserValidator, userController.addUser);

router.route('/:id')
    .get(userValidator.getUserValidator, userController.getUserById)
    .patch(userController.uploadUserImage, userController.resizeImage, userValidator.updateUserValidator, userController.updateUser)
    .delete(userValidator.deleteUserValidator, userController.deleteUser);

module.exports = router;
