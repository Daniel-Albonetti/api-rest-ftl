'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const order = require(path.join(__dirname, 'orders', 'order.js'));
const mailing = require(path.join(__dirname, 'mailing', 'cyber.js'));
const claim_book = require(path.join(__dirname, 'claim_book', 'claim_book.js'));

router.use('/Order', order);
router.use('/mailing/encuesta/', mailing);
router.use('/claimbook/', claim_book);

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api Ordenes Web - Footloose!'
    });
});

module.exports = router;