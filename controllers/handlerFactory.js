const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const document = await Model.findById(id);
        if (!document) {
            return next(new ApiError(`document not found with id ${id}`, 404));
        }
        await document.deleteOne();
        res.status(204).send({
            message: 'document deleted successfully',
        });
    });


const updateOne = (Model) => asyncHandler(async (req, res, next) => {

    const document = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!document) {
        return next(new ApiError(`document not found with id ${req.params.id}`, 404));
    }

    res.status(200).send({
        message: 'document updated successfully',
        data: {
            document
        }
    });
});

module.exports = {
    deleteOne,
    updateOne
};