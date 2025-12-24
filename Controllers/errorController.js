import { appendFile } from 'fs';
import AppError from '../utilities/appError.js';

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to the client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // Programming or other unknown error: don't leak any details to the client
        // 1. log error
        console.error('Error', err);

        // 2. send generic message
        res.status(500).json({
            status: 'error',
            message: 'something went wrong',
        });
    }
};

const handleCastErrorDB = function (err) {
    const message = `invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateErrorDB = function (err) {
    const message = `Duplicate field value: "${err.keyValue.name}". Please use another value`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = function (err) {
    const errors = [];
    Object.keys(err.errors).map((el) => {
        errors.push(err.errors[el].message);
    });
    const message = `Invalid Input Data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = function () {
    return new AppError('Invalid token! Please log in again', 401);
};

const handleJWTExpiredError = function () {
    return new AppError('Session Expired! Please log in again', 401);
};

export const globalErrorHandling = function (err, req, res, next) {
    // app.use(with 4 arguments) is considered as error-handling middleware

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        if (err.name === 'CastError') err = handleCastErrorDB(err);
        if (err.code === 11000) err = handleDuplicateErrorDB(err);
        if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
        if (err.name === 'JsonWebTokenError') err = handleJWTError();
        if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();

        sendErrorProd(err, res);
    }
};
