'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const authenticate = require(path.join(__dirname, 'authenticate', 'authentication.js'));
const guides = require(path.join(__dirname, 'guides', 'guide.js'));

router.use('/authenticate', authenticate);
router.use('/Guide', guides);

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api Web Proveedores - Footloose!'
    });
});

module.exports = router;