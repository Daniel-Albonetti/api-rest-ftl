'use strict'

const path = require('path');
const express = require('express');
const router = express.Router();

const stockDiarioMovController = require(path.join(process.cwd(), 'controllers', 'xamari', 'stock_diario_mov'));

router.post('/registrar', stockDiarioMovController.guardarStockDiarioMov);
router.get('/lista-stock-diario-mov', stockDiarioMovController.listaStockMov);

module.exports = router;