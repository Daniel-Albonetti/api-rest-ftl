'use strict'
const path = require('path');
const express = require('express');
const moment = require('moment');
const router = express.Router();

//const { pool, mssql } = require(path.join(process.cwd(), 'config', 'database.js'));
const { pool} = require(path.join(process.cwd(), 'config', 'database.js'));

router.post('/reporte-desempeno-detalle-dias', async (req, res) => {
    
    try {
        
        
        let codigo= req.body.codigo;
        
        let fechini = moment(req.body.fechini, 'YYYYMMDD').format('YYYY-MM-DD');
        let fechfin = moment(req.body.fechfin, 'YYYYMMDD').format('YYYY-MM-DD');
        
        const connect = await pool;
        const data = await connect.request()

            .query(`select 
			
            FORMAT( CAST(LEFT(a.verificador,8) AS DATE),'dd/MM/yyyy') as fecha_verificacion,
            d.CODIGO,
            d.DESCRIPCION,
            e.nrocaja,
            f.fox_nombre as tienda,
            FORMAT( CAST(LEFT(a.fecha,8) AS DATE),'dd/MM/yyyy') as fecha_flujo
    
            FROM tb_vta_cajacabx  as a  
                    inner join persona as d on d.PERSONA=RIGHT(a.verificador,6) 
                    inner join tb_vta_canalventacaja as e on a.idcaja=e.idcaja
                    inner join CANALVENTA as f on CONCAT(e.cvid,e.canalventa)=CONCAT(f.cvid,f.canalventa)
            WHERE 
                    CAST(LEFT(a.verificador,8) AS DATE) between '${fechini}' and '${fechfin}'
                    and a.verificador!='' and d.CODIGO='${codigo}'
                
            ORDER BY 5 asc`);
       
        if(data.recordset.length<=0)
        {
            return res.status(404).json({msg:'No se encontraron datos'});
        }
        var result = {
            data: data.recordset,
        }
        res.status(200).send(result);
    } catch (e) {
        console.log('reporte.js (/result)', e)
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