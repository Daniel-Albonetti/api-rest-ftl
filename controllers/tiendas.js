/*================================
REQUIRIENDO EL MODELO TIENDA
==================================*/

const ctrTienda = {};
const mdlTienda = require('../models/tiendas');

/*==========================
METOGO POST | /registrar
============================*/

ctrTienda.crearTienda = async (req, res, next) => {

    try {
        
        const respuesta = mdlTienda.create(req.body);
        res.status(200).json(respuesta);

    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR AL GUARDAR TIENDA'});
        next(e);
    }

}

/*===========================
METODO POST | /grupo-tiendas
=============================*/

ctrTienda.grupoTiendas = async (req, res, next) => {

    try {
        
        const respuesta = await mdlTienda.findOne({tienda:req.body.tienda});
        if (!respuesta) {
            return res.status(404).json({ok: false, mensaje:'NO SE ENCONTRÓ LA TIENDA DE USUARIO'});
        }

        const respuesta2 = await mdlTienda.find({grupo:respuesta.grupo})

        if (!respuesta2) {
            return res.status(404).json({ok: false, mensaje:'NO SE ENCONTRARON EL GRUPO DE TIENDA'});
        }

        res.status(200).json({ok: true, tienda: respuesta, grupo: respuesta2});

    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR NO SE PUDIERON LISTAR EL GRUPO DE TIENDAS'});
        next(e);
    }

}

/*==========================
EXPORTANDO EL VALOR DE {}
============================*/

module.exports = ctrTienda;