import fs from 'fs';
import Tour from '../models/tourModel.js';

export const alias = function (req, res, next) {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields =
        'name,price,ratingsAverage,difficulty';
    next();
};

export const getAllTours = async function (req, res) {
    try {
        //TODO 1. Filtering
        // build query
        const queryObj = { ...req.query };
        const excludeFields = [
            'page',
            'sort',
            'limit',
            'fields',
        ];
        excludeFields.forEach((el) => delete queryObj[el]);

        // // // Filtering
        // const tours = await Tour.find(queryObj);

        // Advanced Filtering (url: https://localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy)
        // [gte, gt, lte, lt] : greater than and equal to / greater than / less than and equal to / less than
        // acceptable format of query: { difficulty: 'easy', duration: {$gte: 5} }
        //FIXME converting the format of query:
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`,
        );

        let query = Tour.find(JSON.parse(queryStr));

        //TODO 2. Sorting
        if (req.query.sort) {
            const sortedBy = req.query.sort
                .split(',')
                .join(' ');

            query = query.sort(sortedBy);
        } else {
            query = query.sort('-ratingsQuantity');
        }

        //TODO 3. Field Limiting
        if (req.query.fields) {
            const fields = req.query.fields
                .split(',')
                .join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        //TODO 4. Pagination
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours)
                throw new Error("Page doesn't exists");
        }

        // EXECUTES QUERY
        const tours = await query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error,
        });
    }
};

export const getSingleTour = async function (req, res) {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error,
        });
    }
};

export const createTour = async function (req, res) {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
};

export const updateTour = async function (req, res) {
    try {
        const tour = await Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true },
        );

        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
};

export const deleteTour = async function (req, res) {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
};
