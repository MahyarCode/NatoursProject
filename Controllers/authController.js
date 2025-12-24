import User from '../models/userModel.js';
import { catchAsync } from '../utilities/catchAsyncError.js';
import jwt from 'jsonwebtoken';
import AppError from '../utilities/appError.js';
import { promisify } from 'util';
import { appendFile } from 'fs';

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
        // passwordChangedAt: req.body.passwordChangedAt,
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

export const protect = catchAsync(async function (req, res, next) {
    // 1) getting token and check if it's there
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError(
                'You are not logged in. Please log in to your account',
            ),
        );
    }

    // 2) verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) check if use still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
        return next(
            new AppError(
                'The user belonging to this token does not exists',
                401,
            ),
        );

    // 4) check if user has changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently Changed password. Try Again', 401),
        );
    }

    req.user = currentUser;
    next();
});
