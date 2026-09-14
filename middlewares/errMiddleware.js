module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        handleErrorDev(err, res);
    } else {
        handleErrorProd(err, res);
    }
}


const handleErrorDev = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

const handleErrorProd = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message,
    });
};