const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ProductModel = require('../models/productModel');


// @desc Get all products
// @route GET /api/V1/products
// @access Public
const getAllProducts = asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const products = await ProductModel.find({}).skip(skip).limit(limit).populate('category', 'name');
    res.status(200).json({
        message: 'Products retrieved successfully',
        data: products
    },
    );
});




// @desc Get product by id
// @route GET /api/V1/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await ProductModel.findById(id).populate('category', 'name -_id');
    if (!product) {
        return res.status(404).json({
            message: 'Product not found',
        });
    }
    res.status(200).json({
        message: 'Product retrieved successfully',
        data: product,
    },
    );
});


// @desc Add new product
// @route POST /api/V1/products
// @access Private
const addProduct = asyncHandler(async (req, res) => {
    const { title, description, price, category, stock, thumbnail, priceAfterDiscount, brand, subcategory, image, sold, rating, ratingCount, colors } = req.body;
    const product = new ProductModel({
        title,
        slug: slugify(title, { lower: true }),
        description,
        price,
        category,
        stock,
        thumbnail,
        priceAfterDiscount,
        brand,
        subcategory,
        image,
        sold,
        rating,
        ratingCount,
        colors,
    });
    await product.save();
    res.status(201).json({
        message: 'Product added successfully',
        data: product,
    },
    );
});

// @desc Update product
// @route PATCH /api/V1/products/:id
// @access Private
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, price, category, stock, thumbnail, priceAfterDiscount, brand, subcategory, image, sold, rating, ratingCount, colors } = req.body;

    let slug;
    if (title) {
        slug = slugify(title, { lower: true });
    };

    const product = await ProductModel.findByIdAndUpdate(id, {
        title,
        slug,
        description,
        price,
        category,
        stock,
        thumbnail,
        priceAfterDiscount,
        brand,
        subcategory,
        image,
        sold,
        rating,
        ratingCount,
        colors,
    }, { new: true });
    if (!product) {
        return res.status(404).json({
            message: 'Product not found',
        });
    }


    res.status(200).json({
        message: 'Product updated successfully',
        data: product,
    },
    );
});

// @desc Delete product
// @route DELETE /api/V1/products/:id
// @access Private
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) {
        return res.status(404).json({
            message: 'Product not found',
        });
    }
    res.status(204).json({
        message: 'Product deleted successfully',
        data: product,
    },
    );
});

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
};