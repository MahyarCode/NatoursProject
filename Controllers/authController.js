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

const createSendToken = function (user, statusCode, res) {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() +
                process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        // token,
        data: {
            user,
        },
    });
};

export const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
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

    // 3) if everything is ok, send token to client
    createSendToken(user, 200, res);
});

export const logout = catchAsync(async function (req, res, next) {
    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 1),
        httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
    });
});

// to protect middlewares
export const protect = catchAsync(async function (req, res, next) {
    // 1) getting token and check if it's there
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer') &&
        req.headers.authorization.split(' ')[1] !== 'null'
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(
            new AppError(
                'You are not logged in. Please log in to your account',
                401,
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
    res.locals.user = currentUser;
    next();
});

// only for rendered pages, no errors!!!
export const isLoggedIn = async function (req, res, next) {
    if (req.cookies.jwt) {
        try {
            // verifies the token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET,
            );

            // check if use still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) return next();

            // check if user has changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // There is loggedIn user
            res.locals.user = currentUser;

            return next();
        } catch (error) {
            return next();
        }
    }
    next();
};

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
    // 1) get user based on the token
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
    createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async function (req, res, next) {
    // 1) Get user from collection
    // const user = await User.findById(req.user.id)
    const token = req.cookies.jwt;
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const { id } = decoded;
    const user = await User.findById({ _id: id }).select('+password');

    const { password } = req.body;

    // 2) check if POSTend current password is correct
    if (user && (await user.correctPassword(password, user.password))) {
        // 3) If so, update password
        user.password = req.body.newPassword;
        user.passwordConfirm = req.body.newPasswordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // 4) Log user in, send JWT
        createSendToken(user, 200, res);
    } else {
        return next(
            new AppError('Token may be expired or password is incorrect'),
        );
    }
});
