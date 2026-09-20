const express = require('express');
//? use morgan for logging requests.
const morgan = require('morgan')
const bodyParser = require('body-parser');
require('dotenv').config({ path: 'config.env' });
const databaseConfig = require('./config/database');

const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const ApiError = require('./utils/apiError');
const globalErrorHandling = require('./middlewares/errMiddleware');

const subCategoryRoutes = require('./routes/subCategoryRoutes');

const brandRoutes = require('./routes/brandRoutes');

const productRoutes = require('./routes/productRoutes');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log('Development mode is on');
}

app.use(bodyParser.json());

databaseConfig();

app.use('/api/V1/category', categoryRoutes);
app.use('/api/V1/subCategory', subCategoryRoutes);
app.use('/api/V1/brands', brandRoutes);
app.use('/api/V1/products', productRoutes);
app.all('/{*splat}', (req, res, next) => {

    next(new ApiError(`Not Found ${req.originalUrl}`, 404));
});

app.use(globalErrorHandling);
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// for handling unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});



