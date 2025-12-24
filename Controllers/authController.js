import User from '../models/userModel.js';
import { catchAsync } from '../utilities/catchAsyncError.js';
import jwt from 'jsonwebtoken';
import AppError from '../utilities/appError.js';

const signToken = function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

export const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
});

export const login = catchAsync(async function (req, res, next) {
    const { email, password } = req.body;
    // 1) check if email and password exist
    if (!email || !password) {
        return next(new AppError('please provide email and password', 400));
    }

    // 2) check if the use exists and the password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect Email or Password', 401));
    }

    console.log(user);
    // 3) if everything is ok, send token to client
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
    });
});
