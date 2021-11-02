'use strict'

const path = require('path');

const ctrDetalleProductoML = {};
const mdlDetalleProductoML = require(path.join(process.cwd(), 'models', 'mercado_libre', 'detalle_producto'));

/*================================
METOGO GET | /lista-detalle-producto
===================================*/