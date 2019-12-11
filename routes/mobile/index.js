'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();

const warehouse = require(path.join(__dirname, 'warehouse','files' ,'warehouse.js'));
const authenticate = require(path.join(__dirname, 'warehouse','authenticate', 'authentication.js'));

const user_app = require(path.join(__dirname, 'app_stock','authenticate', 'user_app'));
const productos_app = require(path.join(__dirname, 'app_stock','process', 'productos_app'));
const stock_diario_inicial = require(path.join(__dirname, 'app_stock','process', 'stock_diario_inicial'));
const stock_diario_mov = require(path.join(__dirname, 'app_stock','process', 'stock_diario_mov'));
const tiendas = require(path.join(__dirname, 'app_stock','process', 'tiendas'));

const stock_diario_mov_sql = require(path.join(__dirname, 'app_stock', 'processql', 'stock_diario_inicial'));

router.use('/warehouse/inventory', warehouse);
router.use('/warehouse/authenticate', authenticate);

router.use('/app_stock/authenticate', user_app);
router.use('/app_stock/productos_app', productos_app);
router.use('/app_stock/stock_diario_inicial', stock_diario_inicial);
router.use('/app_stock/stock_diario_mov', stock_diario_mov);
router.use('/app_stock/tiendas', tiendas);

router.use('/app_stock/stock_diario_mov_sql', stock_diario_mov_sql);

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api Mobile - Footloose!'
    });
});


module.exports = router;