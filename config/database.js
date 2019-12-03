'use strict'

const path = require('path');
const config = require(path.join(__dirname, 'config.js')).config();
const mssql = require('mssql');

const params = {
    server: config.DB.SQL.SERVER,
    database: config.DB.SQL.DATABASE,
    user: config.DB.SQL.USER,
    password: config.DB.SQL.PASSWORD,
    port: config.DB.SQL.PORT,
    connectionTimeout: config.DB.SQL.TIMEOUT,
    parseJSON: config.DB.SQL.PARSE_JSON
}

const pool = new mssql.ConnectionPool(params)
    .connect()
    .then(pool => {
        console.log('Conecting to MSSQL');
        return pool;
    })
    .catch(err => console.log('Database Connection Failed! \n Error =>', err));
module.exports = {
    mssql,pool
}