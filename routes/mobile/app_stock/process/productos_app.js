const express = require('express');
const router = express.Router();

const productoAppController = require('../../../../controllers/producto_app');


const { verifyTokenXamari } = require('../../../../middleware/autorization');


router.get('/lista-producto-app', productoAppController.listaProductoApp);
router.post('/lista-curva', [ verifyTokenXamari ], productoAppController.listaCurva);

module.exports = router;