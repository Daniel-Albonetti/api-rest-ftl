'use strict'

const path = require('path');
const express = require('express');
const router = express.Router();

const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));


const {
    upload
} = require(path.join(process.cwd(), 'middleware', 'multer.js'));

const {
    moveFile
} = require(path.join(process.cwd(), 'helpers', 'sip_process.js'));

const {
    verifyTokenFlutter
} = require(path.join(process.cwd(), 'middleware', 'autorization.js'));


//Files
router.post('/upload', upload.single('file'), (req, res) => {
    try {
        let url = req.file.path;
        moveFile(url);
        console.log('moveFile')
        res.status(200).json({
            msg: req.file
        });
    } catch (e) {
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: e
        });
    }
});

router.get('/listactiveinventory/:status',verifyTokenFlutter,async (req,res) => {
    try {
        let estado = req.params.status;
        const connect = await pool;
        const result = await connect.request()
            .input('estado', mssql.Int, estado)
            .query(`SELECT CAST( invcorte_id AS INT) as id, CONCAT(estabcode ,' - ',FORMAT(fechacorte ,'dd/MM/yyyy')) as name FROM wms_passarela.dbo.tb_inventario_corte WHERE estado=${estado} ORDER BY fechacorte DESC`);
        if (result.rowsAffected[0] > 0) {
            res.status(200).send({
                data: result.recordset,
                response: true
            });
        } else {
            res.status(200).send({
                error: 'No se han encontrado resultados',
                response: false
            });
        }
    } catch (e) {
        console.log('Warehouse.js (listactiveinventory)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e)
        });
    }
});

router.post('/insertactiveinventory', verifyTokenFlutter, async (req, res) => {
    try {
        let data = req.body;
        const connect = await pool;
        const result = await connect.request()
            .input('pocket_code', mssql.VarChar, data.poket)
            .input('id_devol', mssql.Int, data.idDevol)
            .input('sku', mssql.VarChar, data.sku)
            .input('ubicode', mssql.VarChar, data.ubicode)
            .input('usercode', mssql.VarChar, data.usercode)
            .input('idInvent', mssql.Int, data.idInvent)
            .input('cant', mssql.Int, data.cant)
            .execute(`wms_passarela.dbo.sp_ic_app_inventario_picking_ins`);
        if (result.rowsAffected[0] > 0) {
            res.status(200).send({
                data: result.recordset,
                response: true
            });
        } else {
            res.status(200).send({
                error: 'No se han encontrado resultados',
                response: false
            });
        }
    } catch (e) {
        console.log('Warehouse.js (insertactiveinventory)', e);
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e)
        });
    }
});


router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api Mobile Almacén!'
    });
});

module.exports = router;