import express from 'express';
import morgan from 'morgan';

import tourRouter from './routes/toursRoutes.js';
import userRouter from './routes/usersRoutes.js';

const app = express();

//TODO Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.requestTime);
    next();
});

//TODO Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
