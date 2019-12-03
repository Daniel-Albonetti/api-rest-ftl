'use strict'
const path = require('path');
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const {
    createClaimBook
} = require(path.join(process.cwd(), 'helpers', 'vtex.js'));

router.post('/receive', async (req, res) => {
    try {
        let info = req.body;
        let book = {
            name: info.nombre,
            lastname: info.apellido,
            documentType: info.tipo_documento,
            nrodoc: info.numero_documento,
            address: info.DireccionUser,
            celphone: info.telefono,
            client: info.email,
            date: new Date(),
            details: info.producto_servicio,
            numberorder: info.num_orden,
            totalsale: info.monto_orden,
            reclamoqueja: info.reclamo_queja,
            description: info.DescripcionReclamo,
            descriptionProduct: info.DescripcionProducto
        };
        let createdClaimBook = await createClaimBook(book);
        if (createdClaimBook.Id) {
            res.status(200).send({
                msg: 'Estamos enviando su reclamo al área respectiva, nos estaremos contactando con Usted a la brevedad posible.',
                response: true
            });
        } else {
            res.status(200).send({
                error: 'Error al guardar Libro de Reclamos, intente nuevamente.',
                response: false
            });
        }
    } catch (e) {
        console.log('Claim Book.js (receive)', e);
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error en el servidor, intente más tarde.',
            msg: new String(e),
            response: false
        });
    }
});

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api Libro de Reclamos!'
    });
});
module.exports = router;