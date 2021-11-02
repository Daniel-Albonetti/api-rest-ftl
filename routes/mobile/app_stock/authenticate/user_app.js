'use strict'

const path = require('path');
const express = require('express');
const router = express.Router();

const usuarioAppController = require(path.join(process.cwd(), 'controllers', 'xamari', 'usuario_app'));

const { verifyTokenXamari, verificarPerfilXamari, verificarSuperAdminPerfilXamari } = require(path.join(process.cwd(), 'middleware', 'autorization'));

router.post('/registrar-admin', usuarioAppController.crearUsuarioAdminApp);
router.get('/lista-all-usuario', [verifyTokenXamari, verificarSuperAdminPerfilXamari], usuarioAppController.listaAllUserApp);
router.post('/registrar', [ verifyTokenXamari, verificarPerfilXamari ], usuarioAppController.crearUsuarioApp);
router.get('/lista-usuario', [ verifyTokenXamari, verificarPerfilXamari ], usuarioAppController.listaUserApp);
router.post('/lista-cod-usuario', [ verifyTokenXamari, verificarPerfilXamari ], usuarioAppController.listaCodUser);
router.put('/update-usuario', [ verifyTokenXamari, verificarPerfilXamari ], usuarioAppController.updateCodUser);
router.delete('/delete-usuario', [verifyTokenXamari], usuarioAppController.deleteCodUser);

router.post('/login-user', usuarioAppController.loginUsuarioApp);

module.exports = router;