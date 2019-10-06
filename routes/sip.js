'use strict'

const path = require('path');
const express = require('express');
const router = express.Router();
const getTokenAPI = require(path.join(path.dirname(__dirname), 'middleware', 'autorization.js')).getTokenAPI;
const pool = require(path.join(path.dirname(__dirname), 'config', 'database.js')).pool;
const mssql = require(path.join(path.dirname(__dirname), 'config', 'database.js')).mssql;

router.post('/authenticate', getTokenAPI, (req, res) => {
    if (req.token) {
        console.log(req.token)
        let token = req.token;
        res.status(200).send({
            token: token
        })
    } else {
        res.status(400).send({
            error: 'Error al generar token, intente nuevamente \nHTTP/1.0 400 Bad Request'
        })
    }
});

module.exports = router;