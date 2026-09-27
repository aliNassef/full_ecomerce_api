const asyncHandler = require('express-async-handler');
const ApiFeature = require('../utils/apiFeature');
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

const createOne = (Model) => asyncHandler(
    async (req, res, next) => {

        const document = new Model(req.body);

        await document.save();
        res.status(201).send({
            message: 'document added successfully',
            data: {
                document
            }
        },);
    }
);



const getOne = (Model) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
        return next(new ApiError(`document not found with id ${id}`, 404));
    }
    res.status(200).send({
        message: 'document retrieved successfully',
        data: {
            document
        }
    });
});


const getAll = (Model, searchKeys) => asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filteredObject) {
        filter = req.filteredObject;
    }
    const documentCount = await Model.countDocuments();
    const apiFeature = new ApiFeature(Model.find(filter), req.query)
        .filter()
        .search(searchKeys)
        .sort()
        .limitFields()
        .paginate(documentCount);

    const { paginationResult, mongooseQuery } = apiFeature;
    const documents = await mongooseQuery;

    res.status(200).send({
        message: 'documents retrieved successfully',
        paginationResult,
        length: documents.length,
        data: {
            documents
        }
    });
});

module.exports = {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll
};