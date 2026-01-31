import express from 'express';
import { rateLimit } from 'express-rate-limit'; // to prevent brutforce attacks ( a global middleware )
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

import morgan from 'morgan';

import AppError from './utilities/appError.js';

import { globalErrorHandling } from './Controllers/errorController.js';
import tourRouter from './routes/toursRoutes.js';
import userRouter from './routes/usersRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import viewRouter from './routes/viewsRoutes.js';

import pug from 'pug';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// setting up the pug template
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//TODO Global Middlewares
//DESC the following line will set the root of the app, to the 'public' folder. So, we can access to the files in 'public' folder using browser.
//DESC like: localhost:3000/overview.html
app.use(express.static(path.join(__dirname, 'public')));

// 2) set security HTTP headers
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                'script-src-elem': [
                    "'self'",
                    "'sha256-ieoeWczDHkReVBsRBqaal5AFMlBtNjMzgwKvLqi/tSU='",
                ],
            },
        },
    }),
);

// selecting environment
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// DESC this limiter prevents the brutforce attack (limit request from the same API)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message: 'Too many Request. Please try again in 15 minutes.',
});
app.use(limiter);

// body parser, reader data from body into req.body
app.use(express.json({ limit: '10kb' })); // limited the request size to utmost 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// TODO the body sanitization security will be written right after the body parser middleware
//  Prevents MongoDB Operator Injection.
app.use(mongoSanitize());

// to sanitize user input coming from POST body, GET queries, and url params. (against XSS)
app.use(xss());

app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    }),
);

// test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
});

//TODO Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
