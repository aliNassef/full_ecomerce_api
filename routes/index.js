
const subCategoryRoutes = require('./subCategoryRoutes');

const brandRoutes = require('./brandRoutes');

const productRoutes = require('./productRoutes');

const userRoutes = require('./userRoute');
const authRoutes = require('./authRoutes');
const reviewRoutes = require('./reviewRoute');
const wishlistRoutes = require('./wishlistRoutes');
const addressRoutes = require('./addressRoutes');
const couponRoutes = require('./couponRoutes');
const categoryRoutes = require('./categoryRoutes');
const cartRoutes = require('./cartRoutes');

const mountRoutes = (app) => {
    app.use('/api/V1/category', categoryRoutes);
    app.use('/api/V1/subCategory', subCategoryRoutes);
    app.use('/api/V1/brands', brandRoutes);
    app.use('/api/V1/products', productRoutes);
    app.use('/api/V1/users', userRoutes);
    app.use('/api/V1/auth', authRoutes);
    app.use('/api/V1/reviews', reviewRoutes);
    app.use('/api/V1/wishlist', wishlistRoutes);
    app.use('/api/V1/addresses', addressRoutes);
    app.use('/api/V1/coupons', couponRoutes);
    app.use('/api/V1/carts', cartRoutes);
};

module.exports = mountRoutes;