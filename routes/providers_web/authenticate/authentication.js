'use strict'

const path = require('path');
const express = require('express');
const router = express.Router();
const {
    getTokenAPI
} = require(path.join(process.cwd(), 'middleware', 'autorization.js'));


/**
 * Autenticación
 */
router.post('/', getTokenAPI, (req, res) => {
    
});

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api Web Proveedores!'
    });
});

module.exports = router;