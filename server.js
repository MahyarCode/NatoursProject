import mongoose from 'mongoose';
import 'dotenv/config';

//TODO handling uncaught error:
process.on('uncaughtException', (err) => {
    process.exit(1);
});

import app from './app.js';

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

//TODO Start The Server
const port = 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

//TODO handling unhandled error (from database for example):
process.on('unhandledRejection', (err) => {
    server.close(() => {
        process.exit(1);
    });
});
