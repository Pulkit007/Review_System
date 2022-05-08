const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const reviewRoute = require('./routes/review');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/user', userRoute);
app.use('/review', reviewRoute);

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

app.listen("3000", () => {
    console.log("Server is running on port 3000");
});
