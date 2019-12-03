'use strict'

const path = require('path');
const express = require('express');
const router = express.Router();
const mercadolibre = require(path.join(__dirname, 'mercado_libre', 'index.js'));
const webproveedores = require(path.join(__dirname, 'providers_web', 'index.js'));
const sip = require(path.join(__dirname, 'sip', 'index.js'));
const ecommerce = require(path.join(__dirname, 'web_orders', 'index.js'));
const mobile = require(path.join(__dirname, 'mobile', 'index.js'));
const fox = require(path.join(__dirname, 'fox', 'index.js'));
const webcomercial = require(path.join(__dirname, 'web_comercial', 'index.js'));

/**
 * Mercado Libre
 */
router.use('/mercadolibre', mercadolibre);

/***
 * Web Provedores
 */
router.use('/webproveedores', webproveedores);

/**
 * SIP
 */
router.use('/sip', sip);

/**
 * Ecommerce
 */
router.use('/ecommerce', ecommerce);

/**
 * Mobile
 */
router.use('/mobile', mobile);

/**
 * Fox
 */
router.use('/fox', fox);

/**
 * Web Comercial
 */
router.use('/webcomercial', webcomercial);

// Router Raiz /
router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Bienvenido a Footloose!'
    });
});

module.exports = router;