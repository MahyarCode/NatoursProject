import express from 'express';
import morgan from 'morgan';

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
    console.log(req.requestTime);
    next();
});
//DESC the following line will set the root of the app, to the 'public' folder. So, we can access to the files in 'public' folder using browser.
//DESC like: localhost:3000/overview.html
app.use(express.static('./public'));

//TODO Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
