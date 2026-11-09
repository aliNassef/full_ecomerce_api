const express = require('express');
//? use morgan for logging requests.
const morgan = require('morgan')
const bodyParser = require('body-parser');
require('dotenv').config({ path: 'config.env' });
const qs = require('qs');
// eslint-disable-next-line import/no-extraneous-dependencies
const compression = require('compression');
const path = require('path');
const databaseConfig = require('./config/database');
// eslint-disable-next-line import/no-extraneous-dependencies, import/order
const cors = require('cors')
const mountRoutes = require('./routes');
const { orderCheckout } = require('./controllers/orderController');

const app = express();
app.use(cors());
app.options('/{*splat}', cors());
app.use(compression());
app.set('query parser', (str) => qs.parse(str));


app.post('/order-checkout', express.raw({ type: 'application/json' }), orderCheckout);

const ApiError = require('./utils/apiError');
const globalErrorHandling = require('./middlewares/errMiddleware');


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log('Development mode is on');
}

app.use(bodyParser.json());
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

databaseConfig();

mountRoutes(app);

app.all('/{*splat}', (req, res, next) => {
    next(new ApiError(`Not Found ${req.originalUrl}`, 404));
});

app.use(globalErrorHandling);
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

// for handling unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});