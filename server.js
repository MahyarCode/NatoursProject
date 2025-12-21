import mongoose from 'mongoose';
import 'dotenv/config';
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
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
