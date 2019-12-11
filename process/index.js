'use strict'

const path = require('path');

const {
    statusFeed
} = require(path.join(__dirname, 'vtex','download', 'vtex_status.js'));

const {
  stockMovimientos
} = require(path.join(__dirname, 'app', 'almacen_stock.js'));

let timeStatus_Vtex = 10 * 60 * 1000; //10 min
let timeStock_Movimientos = 60000; // 1 min

stockMovimientos();
statusFeed();
/**
 * Feed Status Vtex
 */
setInterval(() => {
  statusFeed();
}, timeStatus_Vtex);

/**
 * Stock Movimientos App - Daniel - Jose
 */
setInterval(() => {
  stockMovimientos();
}, timeStock_Movimientos);
