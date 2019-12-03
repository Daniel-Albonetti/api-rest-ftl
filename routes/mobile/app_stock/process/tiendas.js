const express = require('express');
const router = express.Router();

const tiendaController = require('../../../../controllers/tiendas');

router.post('/registrar', tiendaController.crearTienda);
router.post('/grupo-tiendas', tiendaController.grupoTiendas);

module.exports = router;