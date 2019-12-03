'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const training = require(path.join(__dirname, 'rrhh', 'training.js'));
const assistance = require(path.join(__dirname, 'rrhh', 'assistance.js'));
const cubicaje = require(path.join(__dirname, 'logist', 'cubicaje.js'));

router.use('/rrhh/capacitacion', training);
router.use('/rrhh/asistencia', assistance);
router.use('/logist/cubicaje', cubicaje);

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api SIP - Footloose!'
    });
});

module.exports = router;