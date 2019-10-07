'use strict'

const path = require('path');
const express = require('express');
const router = express.Router();
const getTokenAPI = require(path.join(path.dirname(__dirname), 'middleware', 'autorization.js')).getTokenAPI;
const verifyTokenAPI = require(path.join(path.dirname(__dirname), 'middleware', 'autorization.js')).verifyTokenAPI;
const pool = require(path.join(path.dirname(__dirname), 'config', 'database.js')).pool;
const mssql = require(path.join(path.dirname(__dirname), 'config', 'database.js')).mssql;


router.get('/', verifyTokenAPI, (req, res) => {
    res.status(200).send({
        saludo: '¡Footloose te da la bienvenida módulo SIP!'
    });
});

router.post('/authenticate', getTokenAPI, (req, res) => {
    if (req.token) {
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