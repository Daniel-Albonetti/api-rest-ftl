const express = require('express');
const router = express.Router();

const stockDiarioMovController = require('../../../../controllers/stock_diario_mov');

router.post('/registrar', stockDiarioMovController.guardarStockDiarioMov);
router.get('/lista-stock-diario-mov', stockDiarioMovController.listaStockMov);

module.exports = router;