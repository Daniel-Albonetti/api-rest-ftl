'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const web_order = require(path.join(__dirname, 'web_order', 'fox_pro.js'));

router.use('/weborder/', web_order);

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api Fox-Pro - Footloose!'
    });
});

module.exports = router;