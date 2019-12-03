const express = require('express');
const router = express.Router();

const productoAppController = require('../../../../controllers/producto_app');


const { verificarToken } = require('../../../../middleware/autenticacion');


router.get('/lista-producto-app', productoAppController.listaProductoApp);
router.post('/lista-curva', [ verificarToken ], productoAppController.listaCurva);

module.exports = router;