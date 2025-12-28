import fs from 'fs';
import mongoose from 'mongoose';
import 'dotenv/config';
import Tour from '../../models/tourModel.js';

import path from 'path';
import { fileURLToPath } from 'url';

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
        // console.log(connection.connections);
        console.log('DB Connection was successful');
    });

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

const importData = async function () {
    try {
        await Tour.create(tours);
        console.log('Data is successfully loaded');
    } catch (error) {
        console.log(error);
    }
    process.exit();
};

const deleteData = async function () {
    try {
        await Tour.deleteMany();
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
