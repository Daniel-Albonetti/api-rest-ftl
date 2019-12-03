'use strict'

const path = require('path');
const config = require(path.join(__dirname, 'config.js')).config();
const mongoose = require('mongoose');

const URI = `mongodb://${config.DB.MONGO.USER}:${config.DB.MONGO.PASSWORD}@${config.DB.MONGO.SERVER}:${config.DB.MONGO.PORT}/${config.DB.MONGO.DATABASE}`;

mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Conecting to MongoDB")
})