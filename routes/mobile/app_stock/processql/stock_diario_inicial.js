'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();

const { pool} = require(path.join(process.cwd(), 'config', 'database.js'));

router.get('/stock-diario-mov/:id', async (req, res) => {
    
    try {
        
        const connect = await pool;
        const data = await connect.request()

        .query(`SELECT * FROM [dbo].[tmp_alm_stock_diario_mov] WHERE id > ${req.params.id}`);
       
        if(data.recordset.length<=0)
        {
            return res.status(404).json({ok: false, msg:'No se encontraron datos'});
        }
        var result = {
            data: data.recordset,
        }
        res.status(200).send(result);

    } catch (e) {
        console.log('stock_diario_inicial.js (/result)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e)
        });
    }
    
});



module.exports = router;