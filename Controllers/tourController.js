import fs from 'fs';

const data = JSON.parse(
    fs.readFileSync(
        `./dev-data/data/tours-simple.json`,
        'utf-8'
    )
);

export const checkID = function (req, res, next, val) {
    console.log(`the id is: ${val}`);
    if (val > data.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    next();
};

export const checkBody = function (req, res, next) {
    if (req.body.name && req.body.price) {
        next();
    } else {
        res.status(400).json({
            status: 'fail',
            message: 'bad request',
        });
    }
};

export const getAllTours = function (req, res) {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        requestedAt: req.requestTime,
        results: data.length,
        data,
    });
};

export const getSingleTour = function (req, res) {
    const id = +req.params.id;

    const specifiedData = data.find((el) => el.id === id);
    res.status(200).json({
        status: 'success',
        data: specifiedData,
    });
};

export const createTour = function (req, res) {
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

export const updateTour = function (req, res) {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>',
        },
    });
};

export const deleteTour = function (req, res) {
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
