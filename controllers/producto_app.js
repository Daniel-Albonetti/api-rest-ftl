/*========================================
REQUIRIENDO EL MODELO DE PRODUCTOS_APP
==========================================*/

const ctrProductoApp = {};
const mdlProductoApp = require('../models/productos_app');

/*========================================
METODO GET | /lista-producto-app
==========================================*/

ctrProductoApp.listaProductoApp = async (req, res, next) => {

    try {
        
        const respuesta = await mdlProductoApp.find({})
        .limit(50)

        if (!respuesta) {
            return res.status.json({ok: false, mensaje: 'NO SE ENCONTRARON PRODUCTOS APP'});
        }
        res.status(200).json({ok: true, data:respuesta});

    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR AL LISTAR LOS PRODUCTOS APP'});
        next(e);
    }

}

/*==========================
METOGO POST | /lista-curva
============================*/

ctrProductoApp.listaCurva = async (req, res, next) => {

    try {

        let sku = req.body.sku;

        const respuesta = await mdlProductoApp.find({$or:[ {Codigointerno: sku}, {Modelo: sku}, {Descripcion: sku} ]})
        if (respuesta.length <= 0) {
            const respuesta2 = await mdlProductoApp.find({$or:[ {Codigointerno: new RegExp(sku,'i')}, {Modelo:new RegExp(sku,'i')} ]})

            if (respuesta2.length <= 0) {
                return res.status(404).json({ok: false, mensaje: 'ERROR NO SE ENCONTRARON PRODUCTO'});
            }

            let datos = [];
            for (let i = 0; i < respuesta2.length; i++) {
                
                datos.push({
                    codigointerno: respuesta2[i].Codigointerno,
                    categoria: respuesta2[i].Categoria,
                    marca: respuesta2[i].Marca,
                    modelo: respuesta2[i].Modelo,
                    descripcion: respuesta2[i].Categoria +' '+ respuesta2[i].Descripcion,
                    urlimagen: "http://"+respuesta2[i].urlimagen
                })
                
            }

            return res.status(200).json({ok: true, data: datos});
        }

        if (respuesta.length == 1) {

            const respuesta2 = await mdlProductoApp.find({Categoria:respuesta[0].Categoria, Marca:respuesta[0].Marca, Modelo:respuesta[0].Modelo})
            if (respuesta2.length <= 0) {
                return res.status(404).json({ok: false, mensaje: 'ERROR NO SE ENCONTRARON LA FAMILIA DEL SKU'});
            }

            let datos = [];
            for (let i = 0; i < respuesta2.length; i++) {
                
                datos.push({
                    codigointerno: respuesta2[i].Codigointerno,
                    categoria: respuesta2[i].Categoria,
                    marca: respuesta2[i].Marca,
                    modelo: respuesta2[i].Modelo,
                    descripcion: respuesta2[i].Categoria +' '+ respuesta2[i].Descripcion,
                    urlimagen: "http://"+respuesta2[i].urlimagen
                })
                
            }

            return res.status(200).json({ok: true, data: datos});
            
        }

        let datos = [];
        for (let i = 0; i < respuesta.length; i++) {
            
            datos.push({
                codigointerno: respuesta[i].Codigointerno,
                categoria: respuesta[i].Categoria,
                marca: respuesta[i].Marca,
                modelo: respuesta[i].Modelo,
                descripcion: respuesta[i].Categoria +' '+ respuesta[i].Descripcion,
                urlimagen: "http://"+respuesta[i].urlimagen
            })
            
        }

        res.status(200).json({ok: true, data: datos});

    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR AL LISTAR EL STOCK INICIAL'});
        next(e);
    }

}

/*======================================
EXPORTANDO EL VALOR DE {}
========================================*/

module.exports = ctrProductoApp;