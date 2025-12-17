import fs from 'fs';

const data = JSON.parse(
    fs.readFileSync(
        `./dev-data/data/tours-simple.json`,
        'utf-8'
    )
);

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

export const deleteTour = function (req, res) {
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
