'use strict'

const path = require('path');
const config = require(path.join(__dirname, 'config.js')).config();
const mongoose = require('mongoose');

const URI = `mongodb://${config.DB.MONGO.USER}:${config.DB.MONGO.PASSWORD}@${config.DB.MONGO.SERVER}:${config.DB.MONGO.PORT}/${config.DB.MONGO.DATABASE}`;
// const URI = 'mongodb://userFootloose:claveuserfootloose@192.168.50.150:27017/db_footloose';
// const URI = 'mongodb://analytic:always@192.168.50.150:27017/analyticalways';

mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

let server = 'PRODUCCION';
if (URI == 'mongodb://userFootloose:claveuserfootloose@192.168.50.150:27017/db_footloose') {
    server = 'DESARROLLO';
}

const connection = mongoose.connection;
connection.once('open', () => {
    console.log(`Conecting to MongoDB ${server}`)
})