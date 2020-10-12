const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.log('Error!:', err);
        res.status(500).json({
            status: 'Error',
            message: 'Something went wrong! Sorry.',
        })
    }
}



module.exports = (err, req, res, next) => {
    //When you specify these four parameters, Express automatically knows that it's an error handler and only calls this when there's an error.
    err.statusCode = err.statusCode || 500;
    //If statusCode is defined, use that code, else use 500 (internal server error)
    err.status = err.status || 'error';
    //If status is defined, use it. Else, use 'error'.

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    }
};