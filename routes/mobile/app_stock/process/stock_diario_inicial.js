'use strict'

const path = require('path');
const express = require('express');
const router = express.Router();

const stockDiarioInicialController = require(path.join(process.cwd(), 'controllers', 'xamari', 'stock_diario_inicial'));

const { verifyTokenXamari } = require(path.join(process.cwd(), 'middleware', 'autorization'));

router.post('/registrar', [ verifyTokenXamari ], stockDiarioInicialController.crearStockDiarioInicial);
router.post('/lista-stock', [ verifyTokenXamari ], stockDiarioInicialController.listaStockProducto);

module.exports = router;