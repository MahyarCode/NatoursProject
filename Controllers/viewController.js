import Tour from '../models/tourModel.js';
import User from '../models/userModel.js';
import AppError from '../utilities/appError.js';
import { catchAsync } from '../utilities/catchAsyncError.js';

export const getOverview = catchAsync(async function (req, res, next) {
    const tours = await Tour.find();
    res.status(200).render('overview', {
        title: 'Home Page',
        tours,
    });
});

export const getTour = catchAsync(async function (req, res, next) {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });

    if (!tour) {
        return next(new AppError('There is no tour with that name', 404));
    }

    res.status(200).render('tourTemplate', {
        title: `${tour.name} tour`,
        tour,
    });
});

export const goToLoginPage = catchAsync(async function (req, res, next) {
    res.status(200).render('loginTemplate', {
        title: 'Login',
    });
    // next();
});

export const getAccountProfile = catchAsync(async function (req, res, next) {
    res.status(200).render('accountTemplate', {
        title: 'Profile',
    });
});

export const updateMe = catchAsync(async function (req, res, next) {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        },
    );

    res.status(200).render('accountTemplate', {
        title: 'Profile',
        user: updatedUser,
    });
});
