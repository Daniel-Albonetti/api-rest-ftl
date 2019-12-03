'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));

router.get('/', async (req, res) => {
    try {
        // let numOrder = req.params.numeroOrder;
        let numOrder = req.query.order;
        const connect = await pool;
        const data = await connect.request()
            .input('_numeroVersionOrden', mssql.VarChar, numOrder)
            .execute("Ecommerce.dbo.sp_md_getPedidoWeb");
        if (data.recordset.length > 0) {
            res.status(200).send({
                "sitioWebId": data.recordset[0].sitioWebId.toFixed(0),
                "sitioWeb": data.recordset[0].sitioWeb,
                "tipoComprobante": data.recordset[0].tipoComprobante,
                "tipodocumento": data.recordset[0].tipodocumento,
                "razonSocial": data.recordset[0].razonSocial,
                "metodoPago": data.recordset[0].metodoPago,
                "subTotal": data.recordset[0].subTotal.toFixed(2),
                "descuento1": data.recordset[0].descuento1.toFixed(2),
                "descuento2": data.recordset[0].descuento2.toFixed(2),
                "envio": data.recordset[0].envio.toFixed(2),
                "total": data.recordset[0].total.toFixed(2),
                "venta": data.recordset[0].venta.toFixed(2),
                detalle: JSON.parse('[' + data.recordset[0].detalle + ']')
            });
        } else {
            res.status(200).send({msg:"No existe datos"});
        }
    } catch (e) {
        console.log('fox_pro.js (/weborder/:numeroOrder)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e)
        });
    }
});
module.exports = router;