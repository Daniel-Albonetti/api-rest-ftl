'use strict'

const path = require('path');

const ctrStockDiarioMov = {};
const mdlStockDiarioMov = require(path.join(process.cwd(), 'models', 'xamari', 'stock_diario_mov'));

/*=================================
METODO POST | /registrar
===================================*/

ctrStockDiarioMov.guardarStockDiarioMov = async (req, res, next) => {

    try {
        
        const respuesta = await mdlStockDiarioMov.create(req.body);
        res.status(200).json({ok: true, data: respuesta});

    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR AL GUARDAR STOCK DIARIO MOV'});
        next(e);
    }

}

/*====================================
METODO POST | /lista-stock-diario-mov
======================================*/

ctrStockDiarioMov.listaStockMov = async (req, res, next) => {

    try {
        
        const respuesta = await mdlStockDiarioMov.find({}, {id:1})
        .sort({'id':1})
        res.status(200).json({ok: true, data: respuesta});

    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR AL LISTAR STOCK DIARIO MOV'});
        next(e);
    }

}

/*================================
EXPORTANDO EL OBJECT {}
==================================*/

module.exports = ctrStockDiarioMov;