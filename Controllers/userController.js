import User from '../models/userModel.js';
import AppError from '../utilities/appError.js';
import { catchAsync } from '../utilities/catchAsyncError.js';

////////////////////////////////////////////////////////////////////////////////////////////
// DESC multer package to import files
// TODO Multer config as a middleware:
import multer from 'multer';
import sharp from 'sharp';
// DESC diskStorage: to control over your uploads

// // NOTE defining multerStorage in non-efficient way
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         // user-54zx4358hfg8453h-dsdf7h44h94h34kjf98.jpeg
//         const extension = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user._id}-${Date.now()}.${extension}`);
//     },
// });

// NOTE defining multerStorage Efficiently
const multerStorage = multer.memoryStorage();

//DESC Set this to a function to control which files should be uploaded and which should be skipped
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false);
    }
};
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

// TODO upload picture middleware
export const uploadUserPhoto = upload.single('photo');

// TODO resize picture middleware for big picture cases
export const resizeUserPhoto = catchAsync(async function (req, res, next) {
    if (!req.file) return next();
    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
});
////////////////////////////////////////////////////////////////////////////////////////////

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
    if (req.file) filteredObj.photo = req.file.filename;
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
