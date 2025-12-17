import app from './app.js';

//TODO Start The Server
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
