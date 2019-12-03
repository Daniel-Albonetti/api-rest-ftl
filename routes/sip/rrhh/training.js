'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));

router.get('/:id', async(req, res) => {
    try {
        let id_capacitacion = req.params.id;
        const connect = await pool;
        const data = await connect.request()
            .input('opcion', mssql.Int, 3)
            .input('id_capacitacion', mssql.Int, id_capacitacion)
            .input('id_modulo', mssql.Int, 0)
            .input('usr_id_persona', mssql.Int, 0)
            .execute("bd_passarela.dbo.sp_ic_rrhh_solicitud_capacitacion");
        const columns = await connect.request()
            .input('opcion', mssql.Int, 4)
            .input('id_capacitacion', mssql.Int, id_capacitacion)
            .input('id_modulo', mssql.Int, 0)
            .input('usr_id_persona', mssql.Int, 0)
            .execute("bd_passarela.dbo.sp_ic_rrhh_solicitud_capacitacion");

        var result = {
            columns: columns.recordset,
            data: data.recordset,
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
            },
            dom: 'lBfrtip',
            buttons: [
                'excel'
            ]
        }
        res.status(200).send(result);
    } catch (e) {
        console.log('training.js (/:id)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: e
        });
    }
});
router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api SIP!'
    });
});

module.exports = router;