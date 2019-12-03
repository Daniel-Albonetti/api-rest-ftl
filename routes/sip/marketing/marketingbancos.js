'use strict'
const path = require('path');
const express = require('express');
const moment = require('moment');
const router = express.Router();

//const { pool, mssql } = require(path.join(process.cwd(), 'config', 'database.js'));
const { pool} = require(path.join(process.cwd(), 'config', 'database.js'));

router.post('/reporte-ventas-tarjetas-bancos', async (req, res) => {
    
    try {
        
        
        //let codigo= req.body.codigo;
        
        let periodo = req.body.periodo;
        let mes = req.body.mes;
        let banco = req.body.banco;
        let tarjeta = req.body.tarjeta;
        
        const connect = await pool;
        const data = await connect.request()

            .query(`SELECT format(fechdoc,'yyyy-MM-dd') as fecha
            ,tienda
            ,tipdoc
            ,serdoc
            ,numdoc
            ,monto_venta
            ,tarjeta
            ,banco
            ,monto_pago
            
        FROM vw_venta_mpago_tarjeta_banco
      
        where 
        year(fechdoc) ='${periodo}' and 
          month(fechdoc) = '${mes}' and
          banco = '${banco}' and
          tarjeta = '${tarjeta}'
      
      order by fechdoc desc`);
       
        if(data.recordset.length<=0)
        {
            return res.status(404).json({msg:'No se encontraron datos'});
        }
        var result = {
            data: data.recordset,
        }
        res.status(200).send(result);
    } catch (e) {
        console.log('marketingbancos.js (/result)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e)
        });
    }
});



// router.get('/', (req, res) => {
//     res.status(200).json({
//         msg: '¡Api SIP!'
//     });
// });

module.exports = router;