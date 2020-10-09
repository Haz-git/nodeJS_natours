module.exports = (err, req, res, next) => {
    //When you specify these four parameters, Express automatically knows that it's an error handler and only calls this when there's an error.
    err.statusCode = err.statusCode || 500;
    //If statusCode is defined, use that code, else use 500 (internal server error)
    err.status = err.status || 'error';
    //If status is defined, use it. Else, use 'error'.
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
};