'use strict'

const path = require('path');

const {
  statusFeed
} = require(path.join(__dirname, 'vtex', 'download', 'vtex_status.js'));

const {
  stockVtexMorning,
  stockVtexAfternoon,
  stockVtexNight
} = require(path.join(__dirname, 'vtex', 'stock', 'stock.js'));

const {
  usersWoowUpAfternoon,
  usersWoowUpNight
} = require(path.join(__dirname, 'woowup', 'user.js'));

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
 * Stock Vtex
 */
stockVtexMorning;
stockVtexAfternoon;
stockVtexNight;

/**
 * User WoowUp
 */
usersWoowUpAfternoon;
usersWoowUpNight;

/**
 * Stock Movimientos App - Daniel - Jose
 */
setInterval(() => {
  stockMovimientos();
}, timeStock_Movimientos);