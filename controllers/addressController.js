const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');



const addAddress = asyncHandler(async (req, res) => {

    const user = await userModel.findByIdAndUpdate(req.user._id, { $addToSet: { address: req.body } }, { new: true });

    res.status(200).json({
        message: 'Address added successfully',
        data: {
            address: user.address
        }
    });
});

const getAddress = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({
        message: 'Address fetched successfully',
        length: user.address.length,
        data: {
            address: user.address
        }
    });
});

const deleteAddress = asyncHandler(async (req, res) => {

    const user = await userModel.findByIdAndUpdate(req.user._id, { $pull: { address: { _id: req.params.addressId } } }, { new: true });

    res.status(200).json({
        message: 'Address deleted successfully',
        data: {
            address: user.address
        }
    });
});

module.exports = {
    addAddress,
    getAddress,
    deleteAddress
}