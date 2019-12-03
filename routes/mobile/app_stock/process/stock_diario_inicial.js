const express = require('express');
const router = express.Router();

const stockDiarioInicialController = require('../../../../controllers/stock_diario_inicial');

const { verifyTokenXamari } = require('../../../../middleware/autorization');

router.post('/registrar', [ verifyTokenXamari ], stockDiarioInicialController.crearStockDiarioInicial);
router.post('/lista-stock', [ verifyTokenXamari ], stockDiarioInicialController.listaStockProducto);

module.exports = router;