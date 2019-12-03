'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const authenticate = require(path.join(__dirname, 'authenticate', 'autorization.js'));

router.use('/auth', authenticate)

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api Mercado Libre - Footloose!'
    });
});

module.exports = router;