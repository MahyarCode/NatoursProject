import express from 'express';
import fs from 'fs';
import morgan from 'morgan';

const app = express();

//TODO Middlewares
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.requestTime);
    next();
});

//TODO Route Handlers
const data = JSON.parse(
    fs.readFileSync(
        `./dev-data/data/tours-simple.json`,
        'utf-8'
    )
);

//DESC Tour handlers
const getAllTours = function (req, res) {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: data.length,
        data,
    });
};

const getSingleTour = function (req, res) {
    const id = +req.params.id;

    if (id > data.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    const specifiedData = data.find((el) => el.id === id);
    res.status(200).json({
        status: 'success',
        data: specifiedData,
    });
};

const createTour = function (req, res) {
    const newID = data[data.length - 1].id + 1;
    const newTour = Object.assign({ id: newID }, req.body);
    data.push(newTour);

    fs.writeFile(
        './dev-data/data/tours-simple.json',
        JSON.stringify(data),
        (err) => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            });
        }
    );
};

const updateTour = function (req, res) {
    if (+req.params.id > data.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>',
        },
    });
};

const deleteTour = function (req, res) {
    if (+req.params.id > data.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
};

//DESC User handlers
const getAllUsers = function (req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

const createUser = function (req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

const getUser = function (req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

const updateUser = function (req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

const deleteUser = function (req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

//TODO Routes

const toursRoute = express.Router();
const usersRoute = express.Router();

toursRoute.route('/').get(getAllTours).post(createTour);

toursRoute
    .route('/:id')
    .get(getSingleTour)
    .patch(updateTour)
    .delete(deleteTour);

usersRoute.route('/').get(getAllUsers).post(createUser);

usersRoute
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

app.use('/api/v1/tours', toursRoute);
app.use('/api/v1/users', usersRoute);

//TODO Start The Server
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
