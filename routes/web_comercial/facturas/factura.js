'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));

router.post('/consultas/listado/:periodo', async (req, res) => {
    try {
        let periodo = req.params.periodo;
        const connect = await pool;
        const data = await connect.request()
            .input('periodo', mssql.VarChar, periodo)
            .execute(`bd_passarela.dbo.usp_sl_select_tb_fac_serv_cab`);
        let result = {
            data: data.recordset,
        }
        res.status(200).send(result);
    } catch (e) {
        console.log('factura.js (/consultas/listado/:periodo)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e)
        });
    }
});

router.post('/consultas/cab/:id', async (req, res) => {
    try {
        let idCabecera = req.params.id;
        const connect = await pool;
        const data = await connect.request()
            .input('id_fac_cab', mssql.Int, idCabecera)
            .execute(`bd_passarela.dbo.usp_sl_cab_fac_serv`);
        let result = {
            data: data.recordset,
        }
        res.status(200).send(result);
    } catch (e) {
        console.log('factura.js (/consultas/cab/:id)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e)
        });
    }
});

router.post('/consultas/det/:id', async (req, res) => {
    try {
        let idCabecera = req.params.id;
        const connect = await pool;
        const data = await connect.request()
            .input('id_fac_cab', mssql.Int, idCabecera)
            .execute(`bd_passarela.dbo.usp_sl_det_fac_serv`);
        let result = {
            data: data.recordset,
        }
        res.status(200).send(result);
    } catch (e) {
        console.log('factura.js (/consultas/det/:id)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e)
        });
    }
});

router.post('/insert', async (req, res) => {
    try {
        let xmls = req.body;
        const connect = await pool;
        const data = await connect.request()
            .input('XMLC', mssql.Xml, xmls.xmlc)
            .input('XMLd', mssql.Xml, xmls.xmld)
            .execute(`bd_passarela.dbo.usp_sl_insert_fac_serv`);
        let result = {
           data: data.recordset,
        }
        res.status(200).send(result);
    } catch (e) {
        console.log('factura.js (/insert)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e)
        });
    }
});

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api Web Comercial!'
    });
});

module.exports = router;