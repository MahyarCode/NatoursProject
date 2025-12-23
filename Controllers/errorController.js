export const globalErrorHandling = function (err, req, res, next) {
    // app.use(with 4 arguments) is considered as error-handling middleware

    console.error(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
