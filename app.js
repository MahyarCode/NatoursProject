import express from 'express';
import morgan from 'morgan';
import AppError from './utilities/appError.js';
import { globalErrorHandling } from './Controllers/errorController.js';
import tourRouter from './routes/toursRoutes.js';
import userRouter from './routes/usersRoutes.js';

const app = express();

//TODO Middlewares

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
//DESC the following line will set the root of the app, to the 'public' folder. So, we can access to the files in 'public' folder using browser.
//DESC like: localhost:3000/overview.html
app.use(express.static('./public'));

//TODO Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//TODO Handling invalid routes (WHICH MUST BE WRITTEN AS THE LAST MIDDLEWARE)
// '*' will acceptable for all of the http request methods
app.all('*', (req, res, next) => {
    // const err = new Error(
    //     'cannot find ${req.originalUrl} on this server!',
    // );
    // err.status = 'fail';
    // err.statusCode = 404;
    next(new AppError(`cannot find ${req.originalUrl} on this server!`, 404));
    //DESC anything we pass to the next() function, it is considered as error and immediately jumps to error middleware
});

app.use(globalErrorHandling);
export default app;
