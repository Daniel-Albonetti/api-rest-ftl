'use strict'

const path = require('path');
const express = require('express');
const router = express.Router();

const usuarioAppController = require(path.join(process.cwd(), 'controllers', 'xamari', 'usuario_app'));

const { verifyTokenXamari, verificarPerfilXamari } = require(path.join(process.cwd(), 'middleware', 'autorization'));

router.post('/registrar', [ verifyTokenXamari, verificarPerfilXamari ], usuarioAppController.crearUsuarioApp);
router.get('/lista-usuario', [ verifyTokenXamari, verificarPerfilXamari ], usuarioAppController.listaUserApp);
router.post('/lista-cod-usuario', [ verifyTokenXamari, verificarPerfilXamari ], usuarioAppController.listaCodUser);
router.put('/update-usuario', [ verifyTokenXamari, verificarPerfilXamari ], usuarioAppController.updateCodUser);

router.post('/login-user', usuarioAppController.loginUsuarioApp);

module.exports = router;