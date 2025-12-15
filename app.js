import express from 'express';
import fs from 'fs';

const app = express();

const port = 3000;

const data = JSON.parse(
    fs.readFileSync(
        `./dev-data/data/tours-simple.json`,
        'utf-8'
    )
);

const getAllTours = function (req, res) {
    res.status(200).json({
        status: 'success',
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

//TODO the next line is a Middleware
app.use(express.json());

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);

// app.get('/api/v1/tours/:id', getSingleTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//TODO the following code is the better version of above commented lines
app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tours/:id')
    .get(getSingleTour)
    .patch(updateTour)
    .delete(deleteTour);

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
