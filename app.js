import express from 'express';
import fs from 'fs';

const app = express();

const port = 3000;

//TODO This is how you should GET data from a server:
//DESC first, define the data which should be in JSON format
const data = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`, 'utf-8'));

//NOTE for getting all the data
//DESC then, define the method which in its response it should send the data in JSend format
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        //DESC this is called JSend format which represents how data will be transferred via api
        status: 'success',
        results: data.length,
        data,
    });
});

//NOTE for getting single data (like id:5)
app.get('/api/v1/tours/:id', (req, res) => {
    const id = +req.params.id;

    //DESC handling the id that has not existed yet
    if (id > data.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    //DESC if the id exists, then:
    const specifiedData = data.find((el) => el.id === id);
    res.status(200).json({
        status: 'success',
        data: specifiedData,
    });
});

//TODO this is how you should write POST method
//DESC first, we should define a middleware (right now we define it here)
//DESC the 'express.json()' will modify the request before being sent to the server
//DESC if no middleware exists, req.body will be UNDEFINED.
app.use(express.json());
//DESC then, we define how the response should tell us. NOTE in postman, you should provide body for the request before send it.
app.post('/api/v1/tours', (req, res) => {
    //DESC handling new id for new data
    const newID = data[data.length - 1].id + 1;
    const newTour = Object.assign({ id: newID }, req.body);
    //DESC adding the new data to the database variable
    data.push(newTour);

    //DESC rewrite the database (tours-simple.json) and writing the response
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(data), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    });
});

//TODO this is how PATCH request is created
app.patch('/api/v1/tours/:id', (req, res) => {
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
});

//TODO this is how DELETE request is created
app.delete('/api/v1/tours/:id', (req, res) => {
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
});

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
