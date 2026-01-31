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

const filterObj = function (obj, ...allowedItemToUpdate) {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedItemToUpdate.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

export const updateMe = catchAsync(async function (req, res, next) {
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'this route is not for changing password! to change password, please use /updatePassword route.',
                400,
            ),
        );
    }

    const filteredObj = filterObj(req.body, 'name', 'email', '_id');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            updatedUser,
        },
    });
});

export const deleteMe = catchAsync(async function (req, res, next) {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
