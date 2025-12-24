import User from '../models/userModel.js';
import AppError from '../utilities/appError.js';
import { catchAsync } from '../utilities/catchAsyncError.js';

//DESC User handlers
export const getAllUsers = catchAsync(async function (req, res) {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
});

export const createUser = function (req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

export const getUser = function (req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

export const updateUser = function (req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};

export const deleteUser = function (req, res) {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    });
};
