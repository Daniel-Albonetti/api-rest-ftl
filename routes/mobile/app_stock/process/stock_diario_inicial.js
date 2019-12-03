const express = require('express');
const router = express.Router();

const stockDiarioInicialController = require('../../../../controllers/stock_diario_inicial');

const { verificarToken } = require('../../../../middleware/autenticacion');

router.post('/registrar', [ verificarToken ], stockDiarioInicialController.crearStockDiarioInicial);
router.post('/lista-stock', [ verificarToken ], stockDiarioInicialController.listaStockProducto);

module.exports = router;