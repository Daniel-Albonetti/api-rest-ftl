'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));

router.post('/ChangeStatus', async(req, res) => {
    try {
        let id_version = req.query.order;
        let id_persona = req.query.person;
        let id_tipo = req.query.type;
        const connect = await pool;
        const result = await connect.request()
            .input('_persona_ins', mssql.Numeric, id_persona)
            .input('_id_version', mssql.BigInt, id_version)
            .input('_flag_envio', mssql.Bit, 1)
            .input('_tipo', mssql.TinyInt, id_tipo)
            .execute("Ecommerce.dbo.sp_md_insEstadoPedidoWebTotal2");
        res.status(200).send(result.recordset[0]);
    } catch (e) {
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde!',
            msg: e
        });
    }
});

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api Ordenes Web!'
    });
});

module.exports = router;