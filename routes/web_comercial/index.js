'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const facturas = require(path.join(__dirname, 'facturas', 'factura.js'));
const vales = require(path.join(__dirname, 'vales', 'vales.js'));


router.use('/fac_serv/', facturas);
router.use('/vales/', vales);

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api SIP - Web Comercial!'
    });
});

module.exports = router;