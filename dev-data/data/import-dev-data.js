import fs from 'fs';
import mongoose from 'mongoose';
import 'dotenv/config';
import Tour from '../../models/tourModel.js';
import User from '../../models/userModel.js';
import Review from '../../models/reviewModel.js';

import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then((connection) => {
        console.log('DB Connection was successful');
    });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

const importData = async function () {
    try {
        await Tour.create(tours);
        // await User.create(users);
        // await Review.create(reviews);
        console.log('Data is successfully loaded');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

const deleteData = async function () {
    try {
        await Tour.deleteMany();
        // await User.deleteMany();
        // await Review.create(reviews);

        console.log('Data is successfully deleted');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
