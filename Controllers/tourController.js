import fs from 'fs';
import Tour from '../models/tourModel.js';
import APIfeatures from '../utilities/apiFeatures.js';
import AppError from '../utilities/appError.js';
import { catchAsync } from '../utilities/catchAsyncError.js';
import User from '../models/userModel.js';

export const alias = function (req, res, next) {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields = 'name,price,ratingsAverage,difficulty';
    next();
};

export const getAllTours = async function (req, res) {
    try {
        // EXECUTES QUERY
        const features = new APIfeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tours = await features.query;

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

export const getSingleTour = catchAsync(async function (req, res, next) {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        return next(new AppError('No tour has founded', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});

export const createTour = catchAsync(async function (req, res, next) {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour,
        },
    });
});

export const updateTour = catchAsync(async function (req, res, next) {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!tour) {
        return next(new AppError('No tour has founded', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});

export const deleteTour = catchAsync(async function (req, res, next) {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
        return next(new AppError('No tour has founded', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

export const getTourStats = catchAsync(async function (req, res, next) {
    const pipeline = [
        { $match: { ratingsAverage: { $gte: 4.0 } } },
        {
            $group: {
                _id: '$difficulty',
                numTours: { $sum: 1 },
                numRatings: {
                    $sum: '$ratingsQuantity',
                },
                avgRating: { $avg: '$ratingsAverage' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                avgPrice: { $avg: '$price' },
            },
        },
        {
            $sort: { avgPrice: -1 },
        },
    ];
    const stats = await Tour.aggregate(pipeline);

    res.status(200).json({
        status: 'success',
        data: {
            stats,
        },
    });
});

export const getMonthlyPlan = catchAsync(async function (req, res, next) {
    const year = +req.params.year;

    const pipeline = [
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTours: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { numTours: -1 },
        },
    ];

    const plan = await Tour.aggregate(pipeline);

    res.status(200).json({
        status: 'success',
        data: {
            plan,
        },
    });
});

export const getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitutr and longitude in the format lat,lng.',
                400,
            ),
        );
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours,
        },
    });
});

export const getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide latitutr and longitude in the format lat,lng.',
                400,
            ),
        );
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1],
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier,
            },
        },
        {
            $project: {
                distance: 1,
                name: 1,
            },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            data: distances,
        },
    });
});
