'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));


router.get('/consultas/giftlote/:lote', async (req, res) => {
    try {
        let lote = req.params.lote;
        const connect = await pool;
        const result = await connect.request()
            .input('gitlote', mssql.Int,lote)
            .execute(`bd_passarela.dbo.usp_sl_select_vales`);
        res.status(200).send({data:result.recordset});
    } catch (e) {
        console.log('vales.js (/consultas/giftlote/?lote)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e)
        });
    }
});



router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api Web Comercial - Vales!'
    });
});

module.exports = router;