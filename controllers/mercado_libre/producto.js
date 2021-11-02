'use strict'

const path = require('path');

const ctrProductoML = {};
const mdlProductoML = require(path.join(process.cwd(), 'models', 'mercado_libre', 'producto'));

/*================================
METOGO GET | /lista-producto
===================================*/




module.exports = ctrTokenMercadoLibre;