'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const config = require(path.join(process.cwd(), 'config', 'config.js')).config();
const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));

const {
    sendMailHtml
} = require(path.join(process.cwd(), 'helpers', 'mail.js'));

const {
    sendSurvey
} = require(path.join(process.cwd(), 'template', 'mailing', 'cyber_1119-1', 'send_survey.js'));

const {
    decrypt
} = require(path.join(process.cwd(), 'helpers', 'crypto.js'));

const vtex = require(path.join(process.cwd(), 'helpers', 'vtex.js'));

const secret = config.CRYPTO.MAIL.SECRET;
// const campaign = 'encuesta-cyber';

router.post('/receive', async (req, res) => {
    try {
        let info = req.body;
        const connect = await pool;
        // console.log('info', info)
        let data = JSON.parse(decrypt(info.data, secret));
        let id_cabecera = data.cabeceraId;
        if (id_cabecera) {
            // console.log('data', data);
            const result = await connect.request()
                .input('id', mssql.Int, id_cabecera)
                .query(`SELECT epw.id FROM Ecommerce.ecommerce.tb_cabecera_pedido_web AS tcpw INNER JOIN Ecommerce.ecommerce.tb_encuesta_pedido_web AS epw ON epw.tb_cabecera_pedido_web_id = tcpw.id WHERE epw.json_respuesta IS NOT NULL AND epw.codigo_cupon IS NULL AND tcpw.id = @id`);
            if (result.rowsAffected[0] > 0) {
                res.status(200).send({
                    error: 'Ya resolvió la encuesta anteriormente.',
                    response: false
                });
            } else {
                let json_res = JSON.stringify(info).replace("'", "´");
                const update = await connect.request()
                    .input('id', mssql.Int, id_cabecera)
                    .query(`UPDATE Ecommerce.ecommerce.tb_encuesta_pedido_web SET json_respuesta = '${json_res}' WHERE tb_cabecera_pedido_web_id = @id`);
                if (update.rowsAffected[0] > 0) {
                    res.status(200).send({
                        msg: 'Gracias por su tiempo.',
                        response: true
                    });
                } else {
                    res.status(200).send({
                        error: 'Error al guardar encuesta, intente nuevamente.',
                        response: false
                    });
                }
            }
        } else {
            res.status(400).send({
                error: 'HTTP/1.0 400 Bad Request\n Error al enviar encuesta, intente nuevamente',
                response: false
            })
        }
    } catch (e) {
        console.log('Cyber.js (receive)', e);
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e),
            response: false
        });
    }
});

router.post('/send/:id', async (req, res) => {
    try {
        let id_cabecera = req.params.id;
        const connect = await pool;
        const result = await connect.request()
            .input('id', mssql.Int, id_cabecera)
            .query(`SELECT tcpw.numero_order, tcpw.sitio_web, tcpw.nombre_user, tcpw.email_user, tcpw.tipo_identidad_user, tcpw.numero_identidad_user, epw.id FROM Ecommerce.ecommerce.tb_cabecera_pedido_web AS tcpw LEFT JOIN Ecommerce.ecommerce.tb_encuesta_pedido_web AS epw ON epw.tb_cabecera_pedido_web_id = tcpw.id WHERE tcpw.id = @id`);
        if (result.recordset[0].id != null) {
            res.status(200).send({
                error: 'Ya se envió la encuesta al cliente',
                response: false
            });
        } else {
            const info = {
                cabeceraId: id_cabecera,
                site: result.recordset[0].sitio_web.toLowerCase(),
                order: result.recordset[0].numero_order,
                name: result.recordset[0].nombre_user.toUpperCase(),
                mail: result.recordset[0].email_user,
                typeDni: result.recordset[0].tipo_identidad_user,
                dni: result.recordset[0].numero_identidad_user
            };
            let html = await sendSurvey(info);
            // console.log('html', html)
            /**
             * Parametros Mail
             */
            let mailOptions = {
                from: (info.site == "footloose") ? '"Footloose" <ventas.online@footloose.pe>' : '"CierraPuertas.pe" <ventas.online@cierrapuertas.pe>',
                to: "miguel.386984@gmail.com", //info.mail,/** Editar */
                bcc: "miguelduran.footloose@gmail.com",
                subject: `!${info.name}, Footloose te regala 10% Dscto en tu próxima compra!`,
                html: html
            };
            let owner = (info.site == "footloose") ? 'ventas.online@footloose.pe' : 'ventas.online@cierrapuertas.pe';

            let sendMail = await sendMailHtml(mailOptions, owner);
            // console.log('senMail', sendMail)
            if (sendMail.indexOf("250 2.0.0 Ok: queued as") > -1) {
                const insert = await connect.request()
                    .input('id', mssql.Int, id_cabecera)
                    .query(`INSERT INTO Ecommerce.ecommerce.tb_encuesta_pedido_web (tb_cabecera_pedido_web_id) VALUES (@id)`);
                if (insert.rowsAffected[0] > 0) {
                    res.status(200).send({
                        msg: "Se envio el mail correctamente.",
                        response: true
                    });
                } else {
                    res.status(400).send({
                        error: 'HTTP/1.0 400 Bad Request\n Error al insertar envio de mail, intente nuevamente',
                        response: false
                    })
                }
            } else {
                res.status(400).send({
                    error: 'HTTP/1.0 400 Bad Request\n Error al enviar mail, intente nuevamente',
                    response: false
                })
            }
        }
    } catch (e) {
        console.log('Cyber.js (send)', e);
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e),
            response: false
        });
    }
});

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api Mailing Cyber!'
    });
});

module.exports = router;