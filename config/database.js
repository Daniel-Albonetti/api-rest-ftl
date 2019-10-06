'use strict'

const path = require('path');
const config = require(path.join(__dirname, 'config', 'config.js')).config();
const mssql = require('mssql');

const params = {
    server: config.DB.SERVER,
    database: config.DB.DATABASE,
    user: config.DB.USER,
    password: config.DB.PASSWOORD,
    port: config.DB.PORT,
    connectionTimeout: config.DB.TIMEOUT,
    parseJSON: config.DB.PARSE_JSON
}

const pool = new mssql.ConnectionPool(params)
    .connect()
    .then(pool => {
        console.log('Conecting to MSSQL');
        return pool;
    })
    .catch(err => console.log('Database Connection Failed! \n Error =>', err));


module.exports = {
    mssql,
    pool
}