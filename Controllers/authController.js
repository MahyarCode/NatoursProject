import User from '../models/userModel.js';
import { catchAsync } from '../utilities/catchAsyncError.js';
import jwt from 'jsonwebtoken';
import AppError from '../utilities/appError.js';
import { promisify } from 'util';
import sendEmail from '../utilities/email.js';
import crypto from 'crypto';

const signToken = function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

export const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(
        req.body,
        //     {
        //     name: req.body.name,
        //     email: req.body.email,
        //     role: req.body.role,
        //     password: req.body.password,
        //     passwordConfirm: req.body.passwordConfirm,
        //     passwordChangedAt: req.body.passwordChangedAt,
        // }
    );

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

export const restrictTo = function (...roles) {
    return function (req, res, next) {
        // roles: ['admin', 'lead-guide']
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'you do not have permission to do this action',
                    403,
                ),
            );
        }
        next();
    };
};

export const forgetPassword = catchAsync(async function (req, res, next) {
    // 1) get user based on POSTend email
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return next(new AppError('There is no User with email address', 404));

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`;

    const message = `Forgot your password? submit a patch request with your new password and passwordConfirm to: ${resetURL}.\nIf you did not forget your password, please ignore this email`;

    try {
        await sendEmail({
            email: req.body.email, // also req.body.email
            subject: 'Your password reset token (valid for 10 minutes)',
            message,
        });

        res.status(200).json({
            status: 'success',
            message: 'token sent to email',
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email', 500));
    }
});

export const resetPassword = catchAsync(async function (req, res, next) {
    // 1) get use based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    // 2) if token has not expired and there is user, set the new password
    if (!user) {
        return next(new AppError('token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 3) update changePasswordAt property for the user

    // 4) log the user in, send JWT
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
    });
});
