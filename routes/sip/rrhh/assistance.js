'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const excel  = require('excel4node');
const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));

router.get('/', async (req, res) => {
    try {
        let {
            desde,
            hasta,
            codPersona,
            tda_of,
            tda,
            flg_desc,
            tipo_asis
        } = req.query;
        const connect = await pool;

        const data = await connect.request()
            .input('desde', mssql.VarChar, desde)
            .input('hasta', mssql.VarChar, hasta)
            .input('codPersona', mssql.VarChar, codPersona)
            .input('tda_of', mssql.VarChar, tda_of)
            .input('tda', mssql.VarChar, tda)
            .input('flg_desc', mssql.VarChar, flg_desc)
            .input('tipo_asis', mssql.Int, tipo_asis)
            .query(`SELECT
                    id_asistencia
                    ,codigo
                    ,FORMAT(fecha,'yyyy-MM-dd') AS fecha
                    ,dia
                    ,trabajador
                    ,huellero
                    ,area
                    ,id_turno
                    ,modalidad
                    ,LEFT(h_ingreso				,5) AS 	h_ingreso				
                    ,LEFT(h_refrigerio_inicio	,5) AS	h_refrigerio_inicio	
                    ,LEFT(h_refrigerio_fin		,5) AS	h_refrigerio_fin		
                    ,LEFT(h_salida				,5) AS	h_salida				
                    ,LEFT(ingreso				,5) AS	ingreso				
                    ,LEFT(refrigerio_inicio		,5) AS	refrigerio_inicio		
                    ,LEFT(refrigerio_fin		,5) AS	refrigerio_fin		
                    ,LEFT(salida				,5) AS	salida				
                    ,LEFT(m_tardanza			,5) AS	m_tardanza			
                    ,LEFT(m_refrigerio			,5) AS	m_refrigerio			
                    ,LEFT(m_laboradas			,5) AS	m_laboradas			
                    ,LEFT(m_25					,5) AS	m_25					
                    ,LEFT(m_35					,5) AS	m_35
                    ,ISNULL(tipo ,'') AS tipo
                    ,flg_act
                    ,flg_ate
                    FROM view_rrhh_asistencia
                    WHERE fecha BETWEEN @desde AND  @hasta 
                    AND (@codPersona='' OR codigo=@codPersona )
                    AND (@tda_of='' OR flg_ate=@tda_of)
                    AND (@tda='' OR area=@tda) 
                    AND (@flg_desc='' OR flg_des=@flg_desc)
                    AND (@tipo_asis=0 OR id_tipo=@tipo_asis)
                    ORDER BY codigo,fecha`);
        var result = {
            data: data.recordset,
        }
        res.status(200).send(result);
    } catch (e) {
        console.log('assistance.js (/)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e)
        });
    }
});

router.get('/excel', async (req, res) => {
    try {
        let {
            desde,
            hasta,
            codPersona,
            tda_of,
            tda
        } = req.query;
        const connect = await pool;
        const data = await connect.request()
            .input('desde', mssql.VarChar, desde)
            .input('hasta', mssql.VarChar, hasta)
            .input('codPersona', mssql.VarChar, codPersona)
            .input('tda_of', mssql.VarChar, tda_of)
            .input('tda', mssql.VarChar, tda)
            .query(`SELECT
                    id_asistencia
                    ,codigo
                    ,fecha 
                    ,dia
                    ,trabajador
                    ,iSNULL(huellero,'') as huellero
                    ,iSNULL(area,'') AS area
                    ,id_turno
                    ,modalidad
                    ,ISNULL(LEFT(h_ingreso				,5),'-') AS h_ingreso				
                    ,ISNULL(LEFT(h_refrigerio_inicio	,5),'-') AS	h_re_in	
                    ,ISNULL(LEFT(h_refrigerio_fin		,5),'-') AS	h_re_fin		
                    ,ISNULL(LEFT(h_salida				,5),'-') AS	h_salida				
                    ,ISNULL(LEFT(ingreso				,5),'-') AS	ingreso				
                    ,ISNULL(LEFT(refrigerio_inicio		,5),'-') AS	ref_inicio		
                    ,ISNULL(LEFT(refrigerio_fin			,5),'-') AS	refrigerio_fin		
                    ,ISNULL(LEFT(salida					,5),'-') AS	salida				
                    ,ISNULL(LEFT(m_tardanza				,5),'-') AS	m_tardanza			
                    ,ISNULL(LEFT(m_refrigerio			,5),'-') AS	m_refrigerio			
                    ,ISNULL(LEFT(m_laboradas			,5),'-') AS	m_laboradas			
                    ,ISNULL(LEFT(m_25					,5),'-') AS	m_25					
                    ,ISNULL(LEFT(m_35					,5),'-') AS	m_35
                    ,tipo
                    ,flg_act
                    ,flg_ate
                    FROM view_rrhh_asistencia
                    WHERE fecha BETWEEN @desde AND  @hasta 
                    AND (@codPersona='' OR codigo=@codPersona )
                    AND (@tda_of='' OR flg_ate=@tda_of)
                    AND (@tda='' OR area=@tda)
                    ORDER BY codigo,fecha `)
        var val = {
            data: data.recordset,
        }

        var workbook = new excel.Workbook();
        var worksheet = workbook.addWorksheet('Asistencia');
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
            },
            dateFormat: 'd/m/yy',

        });

        worksheet.cell(1, 1).string('CODIGO').style(styleCab);
        worksheet.cell(1, 2).string('FECHA').style(styleCab);
        worksheet.cell(1, 3).string('DIA').style(styleCab);
        worksheet.cell(1, 4).string('Colaborador').style(styleCab);
        worksheet.cell(1, 5).string('Huellero').style(styleCab);
        worksheet.cell(1, 6).string('Tienda/Área').style(styleCab);
        worksheet.cell(1, 7).string('Turno').style(styleCab);
        worksheet.cell(1, 8).string('Modalidad').style(styleCab);
        worksheet.cell(1, 9).string('h_ingreso').style(styleCab);
        worksheet.cell(1, 10).string('h_refrigerio_inicio').style(styleCab);
        worksheet.cell(1, 11).string('h_refrigerio_fin').style(styleCab);
        worksheet.cell(1, 12).string('h_salida').style(styleCab);
        worksheet.cell(1, 13).string('ingreso').style(styleCab);
        worksheet.cell(1, 14).string('refrigerio_inicio').style(styleCab);
        worksheet.cell(1, 15).string('refrigerio_fin').style(styleCab);
        worksheet.cell(1, 16).string('salida').style(styleCab);
        worksheet.cell(1, 17).string('m_tardanza').style(styleCab);
        worksheet.cell(1, 18).string('m_refrigerio').style(styleCab);
        worksheet.cell(1, 19).string('m_laboradas').style(styleCab);
        worksheet.cell(1, 20).string('m_25').style(styleCab);
        worksheet.cell(1, 21).string('m_35').style(styleCab);
        worksheet.cell(1, 22).string('Tipo Asist').style(styleCab);
        worksheet.cell(1, 23).string('Estado').style(styleCab);

        let celda = 2;
        let result = val.data;

        for (let i in result) {
            worksheet.cell(celda, 1).string(result[i].codigo).style(style);
            worksheet.cell(celda, 2).date(result[i].fecha).style(style);
            worksheet.cell(celda, 3).string(result[i].dia).style(style);
            worksheet.cell(celda, 4).string(result[i].trabajador).style(style);
            worksheet.cell(celda, 5).string(result[i].huellero).style(style);
            worksheet.cell(celda, 6).string(result[i].area).style(style);
            worksheet.cell(celda, 7).string(result[i].id_turno).style(style);
            worksheet.cell(celda, 8).string(result[i].modalidad).style(style);
            worksheet.cell(celda, 9).string(result[i].h_ingreso).style(style);
            worksheet.cell(celda, 10).string(result[i].h_re_in).style(style);
            worksheet.cell(celda, 11).string(result[i].h_re_fin).style(style);
            worksheet.cell(celda, 12).string(result[i].h_salida).style(style);
            worksheet.cell(celda, 13).string(result[i].ingreso).style(style);
            worksheet.cell(celda, 14).string(result[i].ref_inicio).style(style);
            worksheet.cell(celda, 15).string(result[i].refrigerio_fin).style(style);
            worksheet.cell(celda, 16).string(result[i].salida).style(style);
            worksheet.cell(celda, 17).string(result[i].m_tardanza).style(style);
            worksheet.cell(celda, 18).string(result[i].m_refrigerio).style(style);
            worksheet.cell(celda, 19).string(result[i].m_laboradas).style(style);
            worksheet.cell(celda, 20).string(result[i].m_25).style(style);
            worksheet.cell(celda, 21).string(result[i].m_35).style(style);
            worksheet.cell(celda, 22).string(result[i].tipo).style(style);
            worksheet.cell(celda, 23).string(result[i].flg_act).style(style);
            celda++
        }
        workbook.write(`Asistencia${desde}-${hasta}.xlsx`, res);
    } catch (e) {
        console.log('assistance.js (/excel)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e)
        });
    }
});

router.get('/result', async (req, res) => {
    try {
        let {
            id_asist
        } = req.query;
        const connect = await pool;
        const data = await connect.request()
            .input('id_asist', mssql.Numeric, id_asist)
            .query(`SELECT 
            id_asistencia
            ,FORMAT(fecha,'yyyy-MM-dd') as fecha
            ,CONCAT(p.codigo,': ',p.nombre,' ',p.paterno,' ',p.materno) AS id_persona
            ,id_turno
            ,modalidad
            ,id_tipo
            ,centrocostoconta
            ,LEFT(h_ingreso				,8) AS h_in
            ,LEFT(h_refrigerio_inicio	,8) AS h_ref
            ,LEFT(h_refrigerio_fin		,8) AS h_refin
            ,LEFT(h_salida				,8) AS h_sal
            ,LEFT(ingreso				,8) AS ingr
            ,LEFT(refrigerio_inicio		,8) AS ref_in
            ,LEFT(refrigerio_fin		,8) AS ref_sa
            ,LEFT(salida 				,8) AS sali
            ,descargo AS descargo 
            FROM tb_marcaciones_asistencia a 
            INNER JOIN persona p WITH(NOLOCK) on a.id_persona=p.persona
            WHERE id_asistencia=@id_asist`);
        var result = {
            data: data.recordset,
        }
        res.status(200).send(result);
    } catch (e) {
        console.log('assistance.js (/result)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e)
        });
    }
});

router.put('/update', async (req, res) => {
    try {
        let {
            id_asistencia,
            id_turno,
            id_tipo,
            modalidad,
            centrocostoconta,
            usr_id_persona,
            h_ingreso,
            h_refrigerio_inicio,
            h_refrigerio_fin,
            h_salida,
            ingreso,
            refrigerio_inicio,
            refrigerio_fin,
            salida
        } = req.body;
        const connect = await pool;
        const data = await connect.request()
            .input('id_asistencia', mssql.Numeric, id_asistencia)
            .input('id_turno', mssql.Int, id_turno)
            .input('modalidad', mssql.VarChar, modalidad)
            .input('id_tipo', mssql.Int, id_tipo)
            .input('centrocostoconta', mssql.VarChar, centrocostoconta)
            .input('h_ingreso', mssql.VarChar, h_ingreso)
            .input('h_refrigerio_inicio', mssql.VarChar, h_refrigerio_inicio)
            .input('h_refrigerio_fin', mssql.VarChar, h_refrigerio_fin)
            .input('h_salida', mssql.VarChar, h_salida)
            .input('ingreso', mssql.VarChar, ingreso)
            .input('refrigerio_inicio', mssql.VarChar, refrigerio_inicio)
            .input('refrigerio_fin', mssql.VarChar, refrigerio_fin)
            .input('salida', mssql.VarChar, salida)
            .query(`UPDATE tb_marcaciones_asistencia SET  
             id_turno				=  @id_turno				
            ,modalidad				=  @modalidad				
            ,id_tipo				=  @id_tipo				
            ,centrocostoconta		=  @centrocostoconta		
            ,h_ingreso				=  @h_ingreso				
            ,h_refrigerio_inicio	=  @h_refrigerio_inicio	
            ,h_refrigerio_fin		=  @h_refrigerio_fin		
            ,h_salida				=  @h_salida				
            ,ingreso				=  IIF(LEFT(@ingreso		   	,5)='00:00' , NULL , @ingreso)		   	 
            ,refrigerio_inicio		=  IIF(LEFT(@refrigerio_inicio	,5)='00:00' , NULL , @refrigerio_inicio)
            ,refrigerio_fin			=  IIF(LEFT(@refrigerio_fin		,5)='00:00' , NULL , @refrigerio_fin)			
            ,salida					=  IIF(LEFT(@salida				,5)='00:00' , NULL , @salida)	
            WHERE id_asistencia     =  @id_asistencia`);
            await connect.request()
            .input('id_asistencia', mssql.Numeric, id_asistencia)
            .input('usr_id_persona', mssql.Numeric, usr_id_persona)
            .query(`UPDATE a SET a.isError=0,
           a.fechahorapersona= CONCAT('OK  ',p.codigo,' -> ',FORMAT(GETDATE(),'dd/MM/yyyy HH:mm:ss'))
           FROM tb_marcaciones_asistencia a 
           LEFT JOIN persona p on a.id_asistencia=@id_asistencia WHERE p.persona=@usr_id_persona`)
        var result = {
            ok: true,
            data: data,
            mensaje: "Se Actualizaron los Datos Correctamente!",
        }
        res.status(200).send(result);
    } catch (e) {
        console.log('assistance.js (/update)', e)
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