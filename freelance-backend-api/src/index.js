const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { body, validationResult, check } = require('express-validator');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const app = express();
const path = require('path');
const Transport = require("nodemailer-brevo-transport");
const route= require("./router/routes")

require("dotenv").config({
    path: '../.env', // Adjust the path to point outside the src folder
});

 console.log(process.env.ACCESS_TOKEN_SECRET)

//const dotenv= require("dotenv")
// dotenv.config({
//     path: '.    /env',
//   });


app.use(express.json());
//app.set('trust proxy', true);
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb+srv://16039233:16039233@hariom-semwal.ylnslae.mongodb.net/PLATFORM', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 
})
.then(() => {
    console.log("MongoDB connected successfully");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});


app.use('/', route);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
