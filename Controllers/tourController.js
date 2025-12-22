import fs from 'fs';
import Tour from '../models/tourModel.js';
import APIfeatures from '../utilities/apiFeatures.js';

export const alias = function (req, res, next) {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields =
        'name,price,ratingsAverage,difficulty';
    next();
};

export const getAllTours = async function (req, res) {
    try {
        // EXECUTES QUERY
        const features = new APIfeatures(
            Tour.find(),
            req.query,
        )
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tours = await features.query;
        console.log(tours);

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
