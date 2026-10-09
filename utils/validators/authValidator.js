const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/valdatorMiddleware');
const UserModel = require('../../models/userModel');

module.exports = {
    signupValidator: [
        check('name')
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 3 })
            .custom((val, { req }) => {
                req.body.slug = slugify(val, { lower: true });
                return true;
            }),
        check('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is invalid')
            .custom(async (val) => {
                const user = await UserModel.findOne({ email: val });
                if (user) {
                    throw new Error('User already exists');
                }
                return true;
            }),
        check('password')
            .notEmpty()
            .withMessage('Password is required'),
        validatorMiddleware,
    ],

    loginValidator: [
        check('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is invalid')
        ,
        check('password')
            .notEmpty()
            .withMessage('Password is required'),
        validatorMiddleware,
    ],

    forgetPasswordValidator: [
        check('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is invalid')
            .toLowerCase(),
        validatorMiddleware,
    ],
}