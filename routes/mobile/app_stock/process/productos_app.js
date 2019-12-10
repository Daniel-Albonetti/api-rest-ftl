'use strict'

const path = require('path');
const express = require('express');
const router = express.Router();

const productoAppController = require(path.join(process.cwd(), 'controllers', 'xamari', 'producto_app'));

const { verifyTokenXamari } = require(path.join(process.cwd(), 'middleware', 'autorization'));

router.post('/lista-curva', [ verifyTokenXamari ], productoAppController.listaCurva);

module.exports = router;