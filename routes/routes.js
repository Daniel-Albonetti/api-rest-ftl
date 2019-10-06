'use strict'

var express = require('express');
var router = express.Router();

// Router Raiz /
router.get('/', (req, res) => {
    res.json({
        saludo: '¡Footloose PRUEBAS te da la bienvenida!'
    });
});

// Router /api
router.get('/api', (req, res) => {
    res.json({
        message: 'Servicios de API de Footloose'
    });
});

module.exports = router;