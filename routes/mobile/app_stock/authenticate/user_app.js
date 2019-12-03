const express = require('express');
const router = express.Router();

const usuarioAppController = require('../../../../controllers/usuario_app');

router.post('/registrar', usuarioAppController.crearUsuarioApp);
router.post('/login-user', usuarioAppController.loginUsuarioApp);

module.exports = router;