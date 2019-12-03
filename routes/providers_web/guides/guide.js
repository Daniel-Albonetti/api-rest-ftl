'use strict'

const path = require('path');
const express = require('express');
const router = express.Router();
const {
    verifyTokenAPI
} = require(path.join(process.cwd(), 'middleware', 'autorization.js'));

const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));


/**
 * Actualización
 */
router.post('/Update/GuideReception', verifyTokenAPI, async(req, res) => {
    try {
        let idProveedor = req.query.proveedor;
        let serieGuia = req.query.serie;
        let numeroIniGuia = req.query.numeroIni;
        let numeroFinGuia = req.query.numeroFin;
        let fechaGuia = req.query.fecha;

        const connect = await pool;
        const result = await connect.request()
            .input('fecha_recepcion', mssql.VarChar, fechaGuia)
            .input('idproveedor', mssql.Numeric, idProveedor)
            .input('serie', mssql.VarChar, serieGuia)
            .input('numeroIni', mssql.VarChar, numeroIniGuia)
            .input('numeroFin', mssql.VarChar, numeroFinGuia)
            .execute("webproveedores.dbo.SP_UPDATE_GUIAS");
        res.status(200).send(result.recordset[0]);

    } catch (e) {
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: e
        });
    }
});

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api Web Proveedores!'
    });
});

module.exports = router;