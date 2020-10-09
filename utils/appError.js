//Our class should have everything that the Error class does. Inheriting from it.

class AppError extends Error {
    constructor(message, statusCode) {
        //calling constructor of parent class, will only pass in message because Error object only accepts that.
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
        //Since this class was created to handle operational errors, we will add a property which confirms so.
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;