'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const excel  = require('excel4node');
const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api SIP Logistica!'
    });
});

router.get('/excel', async (req, res) => {
    try {        
        const connect = await pool;
        const data = await connect.request()
            .query(`SELECT nombre,
            responsable,
            fecha,
            GpoMueble,
            mueble,
            GpoCalzado,
            categoria,
            cantidad,
            filas,
            alto,
            ancho,
            largo,
            obs,
            ISNULL(ratio_verano_carga, 0)      AS ratio_verano_carga,
            ISNULL(ratio_verano_factor, 0)     AS ratio_verano_factor,
            ISNULL(ratio_verano_facalto, 0)    AS ratio_verano_facalto,
            ISNULL(ratio_verano_facancho, 0)   AS ratio_verano_facancho,
            ISNULL(ratio_verano_faclargo, 0)   AS ratio_verano_faclargo,
            ISNULL(ratio_invierno_carga, 0)    AS ratio_invierno_carga,
            ISNULL(ratio_invierno_factor, 0)   AS ratio_invierno_factor,
            ISNULL(ratio_invierno_facalto, 0)  AS ratio_invierno_facalto,
            ISNULL(ratio_invierno_facancho, 0) AS ratio_invierno_facancho,
            ISNULL(ratio_invierno_faclargo, 0) AS ratio_invierno_faclargo,
            ISNULL(ajusteModelo, 0)            AS ajusteModelo,
            ISNULL(ajustePares, 0)             AS ajustePares,
            CAST(ISNULL(ModVe, 0)              AS INT) AS ModVe,
            CAST(ISNULL(AlmVe, 0)              AS INT) AS AlmVe,
            CAST(ISNULL(ModEstVe, 0)           AS INT) AS ModEstVe,
            CAST(ISNULL(AlmEstVe, 0)           AS INT) AS AlmEstVe,
            CAST(ISNULL(ModTotVe, 0)           AS INT) AS ModTotVe,
            CAST(ISNULL(AlmTotVe, 0)           AS INT) AS AlmTotVe,
            CAST(ISNULL(ModInv, 0)             AS INT) AS ModInv,
            CAST(ISNULL(AlmInv, 0)             AS INT) AS AlmInv,
            CAST(ISNULL(ModEstInv, 0)          AS INT) AS ModEstInv,
            CAST(ISNULL(AlmEstInv, 0)          AS INT) AS AlmEstInv,
            CAST(ISNULL(ModTotInv, 0)          AS INT) AS ModTotInv,
            CAST(ISNULL(AlmTotInv, 0)          AS INT) AS AlmTotInv,
            tienda,
            zona,
            estado,
            Distrito,
            TpoTda,
            ISNULL(clastamano,'') AS clastamano,
            isnull(TdaGpo,'') AS TdaGpo
            FROM   view_cubicaje_tienda_inventario_detalle`)
        var val = {
            data: data.recordset,
        }

        var workbook = new excel.Workbook();
        var worksheet = workbook.addWorksheet('Informacion Cubicaje');
        var styleCab = workbook.createStyle({
            font: {
                color: '#030303',
                size: 12
            },
            fill: {
                type: 'pattern', // the only one implemented so far.
                patternType: 'solid', // most common.
                fgColor: '#17b0cb', // you can add two extra characters to serve as alpha, i.e. '2172d7aa'.
            }
        });
        var style = workbook.createStyle({
            font: {
                color: '#030303',
                size: 10
            }
        });
        var style2 = workbook.createStyle({
            font: {
                color: '#030303',
                size: 10
            },
            // numberFormat: '#,###; (#,###.##);',
        });

        worksheet.cell(1, 1).string('nombre').style(styleCab);
        worksheet.cell(1, 2).string('responsable').style(styleCab);
        worksheet.cell(1, 3).string('fecha').style(styleCab);
        worksheet.cell(1, 4).string('GpoMueble').style(styleCab);
        worksheet.cell(1, 5).string('mueble').style(styleCab);
        worksheet.cell(1, 6).string('GpoCalzado').style(styleCab);
        worksheet.cell(1, 7).string('categoria').style(styleCab);
        worksheet.cell(1, 8).string('cantidad').style(styleCab);
        worksheet.cell(1, 9).string('filas').style(styleCab);
        worksheet.cell(1, 10).string('alto').style(styleCab);
        worksheet.cell(1, 11).string('ancho').style(styleCab);
        worksheet.cell(1, 12).string('largo').style(styleCab);
        worksheet.cell(1, 13).string('obs').style(styleCab);
        worksheet.cell(1, 14).string('ratio_verano_carga').style(styleCab);
        worksheet.cell(1, 15).string('ratio_verano_factor').style(styleCab);
        worksheet.cell(1, 16).string('ratio_verano_facalto').style(styleCab);
        worksheet.cell(1, 17).string('ratio_verano_facancho').style(styleCab);
        worksheet.cell(1, 18).string('ratio_verano_faclargo').style(styleCab);
        worksheet.cell(1, 19).string('ratio_invierno_carga').style(styleCab);
        worksheet.cell(1, 20).string('ratio_invierno_factor').style(styleCab);
        worksheet.cell(1, 21).string('ratio_invierno_facalto').style(styleCab);
        worksheet.cell(1, 22).string('ratio_invierno_facancho').style(styleCab);
        worksheet.cell(1, 23).string('ratio_invierno_faclargo').style(styleCab);
        worksheet.cell(1, 24).string('ajusteModelo').style(styleCab);
        worksheet.cell(1, 25).string('ajustePares').style(styleCab);
        worksheet.cell(1, 26).string('ModVe').style(styleCab);
        worksheet.cell(1, 27).string('AlmVe').style(styleCab);
        worksheet.cell(1, 28).string('ModEstVe').style(styleCab);
        worksheet.cell(1, 29).string('AlmEstVe').style(styleCab);
        worksheet.cell(1, 30).string('ModTotVe').style(styleCab);
        worksheet.cell(1, 31).string('AlmTotVe').style(styleCab);
        worksheet.cell(1, 32).string('ModInv').style(styleCab);
        worksheet.cell(1, 33).string('AlmInv').style(styleCab);
        worksheet.cell(1, 34).string('ModEstInv').style(styleCab);
        worksheet.cell(1, 35).string('AlmEstInv').style(styleCab);
        worksheet.cell(1, 36).string('ModTotInv').style(styleCab);
        worksheet.cell(1, 37).string('AlmTotInv').style(styleCab);
        worksheet.cell(1, 38).string('tienda').style(styleCab);
        worksheet.cell(1, 39).string('zona').style(styleCab);
        worksheet.cell(1, 40).string('estado').style(styleCab);
        worksheet.cell(1, 41).string('Distrito').style(styleCab);
        worksheet.cell(1, 42).string('TpoTda').style(styleCab);
        worksheet.cell(1, 43).string('clastamano').style(styleCab);
        worksheet.cell(1, 44).string('TdaGpo').style(styleCab);
        let celda = 2;
        let result = val.data;

        for (let i in result) {
            worksheet.cell(celda, 1).string(result[i].nombre).style(style);
            worksheet.cell(celda, 2).string(result[i].responsable).style(style);
            worksheet.cell(celda, 3).date(result[i].fecha).style(style);
            worksheet.cell(celda, 4).string(result[i].GpoMueble).style(style);
            worksheet.cell(celda, 5).string(result[i].mueble).style(style);
            worksheet.cell(celda, 6).string(result[i].GpoCalzado).style(style);
            worksheet.cell(celda, 7).string(result[i].categoria).style(style);
            worksheet.cell(celda, 8).number(result[i].cantidad).style(style);
            worksheet.cell(celda, 9).number(result[i].filas).style(style);
            worksheet.cell(celda, 10).number(result[i].alto).style(style);
            worksheet.cell(celda, 11).number(result[i].ancho).style(style);
            worksheet.cell(celda, 12).number(result[i].largo).style(style);
            worksheet.cell(celda, 13).string(result[i].obs).style(style);
            worksheet.cell(celda, 14).number(result[i].ratio_verano_carga).style(style);
            worksheet.cell(celda, 15).number(result[i].ratio_verano_factor).style(style);
            worksheet.cell(celda, 16).number(result[i].ratio_verano_facalto).style(style);
            worksheet.cell(celda, 17).number(result[i].ratio_verano_facancho).style(style);
            worksheet.cell(celda, 18).number(result[i].ratio_verano_faclargo).style(style);
            worksheet.cell(celda, 19).number(result[i].ratio_invierno_carga).style(style);
            worksheet.cell(celda, 20).number(result[i].ratio_invierno_factor).style(style);
            worksheet.cell(celda, 21).number(result[i].ratio_invierno_facalto).style(style);
            worksheet.cell(celda, 22).number(result[i].ratio_invierno_facancho).style(style);
            worksheet.cell(celda, 23).number(result[i].ratio_invierno_faclargo).style(style);
            worksheet.cell(celda, 24).number(result[i].ajusteModelo).style(style);
            worksheet.cell(celda, 25).number(result[i].ajustePares).style(style);
            worksheet.cell(celda, 26).number(result[i].ModVe).style(style2);
            worksheet.cell(celda, 27).number(result[i].AlmVe).style(style2);
            worksheet.cell(celda, 28).number(result[i].ModEstVe).style(style2);
            worksheet.cell(celda, 29).number(result[i].AlmEstVe).style(style2);
            worksheet.cell(celda, 30).number(result[i].ModTotVe).style(style2);
            worksheet.cell(celda, 31).number(result[i].AlmTotVe).style(style2);
            worksheet.cell(celda, 32).number(result[i].ModInv).style(style2);
            worksheet.cell(celda, 33).number(result[i].AlmInv).style(style2);
            worksheet.cell(celda, 34).number(result[i].ModEstInv).style(style2);
            worksheet.cell(celda, 35).number(result[i].AlmEstInv).style(style2);
            worksheet.cell(celda, 36).number(result[i].ModTotInv).style(style2);
            worksheet.cell(celda, 37).number(result[i].AlmTotInv).style(style2);
            worksheet.cell(celda, 38).string(result[i].tienda).style(style);
            worksheet.cell(celda, 39).string(result[i].zona).style(style);
            worksheet.cell(celda, 40).string(result[i].estado).style(style);
            worksheet.cell(celda, 41).string(result[i].Distrito).style(style);
            worksheet.cell(celda, 42).string(result[i].TpoTda).style(style);
            worksheet.cell(celda, 43).string(result[i].clastamano).style(style);
            worksheet.cell(celda, 44).string(result[i].TdaGpo).style(style);
            celda++
        }
        let fech=new Date().toISOString();
        let fecha= fech.substring(0,10)
        
        workbook.write(`logisticaCubicaje_${fecha}.xlsx`, res);
    } catch (e) {
        console.log('logistics.js (/excel)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e)
        });
    }
});





module.exports = router;