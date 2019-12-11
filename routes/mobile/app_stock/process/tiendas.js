'use strict'

const path = require('path');

const express = require('express');
const router = express.Router();

const tiendaController = require(path.join(process.cwd(), 'controllers', 'xamari', 'tiendas'));

router.post('/registrar', tiendaController.crearTienda);
router.post('/grupo-tiendas', tiendaController.grupoTiendas);

module.exports = router;