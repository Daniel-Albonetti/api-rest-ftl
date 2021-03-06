'use strict'

const path = require('path');

const ctrStockDiarioIncial = {};

const mdlStockDiarioIncial = require(path.join(process.cwd(), 'models', 'xamari', 'stock_diario_inicial'));
const mdlStockDiarioMov = require(path.join(process.cwd(), 'models', 'xamari', 'stock_diario_mov'));
const mdlTienda = require(path.join(process.cwd(), 'models', 'xamari', 'tiendas'));

/*==========================
METOGO POST | /registrar
============================*/

ctrStockDiarioIncial.crearStockDiarioInicial = async (req, res, next) => {

    try {

        const respuesta = await mdlStockDiarioIncial.create(req.body);
        res.status(200).json(respuesta);
        
    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR AL CREAR STOCK DIARIO INICIAL'});
        next(e);
    }

}

/*==================================
METODO POST | /lista-stock
====================================*/

ctrStockDiarioIncial.listaStockProducto = async (req, res, next) => {

    try {

        let sku = req.body.sku;
        let tienda = req.body.tienda;

        if (!tienda && sku) {
            return res.status(404).json({ok: false, mensaje: 'PARAMETROS ENVIADOS INCORRECTOS'});
        }

        if (sku.length != 11) {
            return res.status(404).json({ok: false, mensaje: 'ERROR NO SE RECONOCE COMO SKU'});
        }

        if (!/^([0-9])*$/.test(sku)){
            return res.status(404).json({ok: false, mensaje: 'NO SE PERMITEN LETRAS'});
        }

        const respuestaTienda = await mdlStockDiarioIncial.find({Codigointerno:sku}, {Tda:1, Codigointerno:1, stock:1, precioetiqueta:1, precioventa:1});
        if (respuestaTienda.length <= 0) {
            //return res.status(404).json({ok: false, mensaje: 'EL SKU NO SE RECONOCE COMO STOCK INICIAL'});

            const respuesta2 = await mdlStockDiarioMov.find({Codigointerno:sku}, {id:1, Tda:1, Codigointerno:1, stock:1, precioetiqueta:1, precioventa:1})
            .sort({'id':-1});
            if (respuesta2.length <= 0) {
                return res.status(200).json({ok: false, mensaje: 'ERROR! SKU NO ENCONTRADO EN LA BASE DE DATOS DE STOCK POR SUCURSAL'});
            }

            const respuesta3 = await mdlTienda.findOne({tienda:tienda});
            if (respuesta3 == null) {
                return res.status(404).json({ok: false, mensaje: "LO SENTIMOS LA TIENDA NO FUE ENCONTRADA EN TABLE MOVIMIENTOS"});
            }

            const respuesta4 = await mdlTienda.find({grupo:respuesta3.grupo});
            if (respuesta4.length <= 0) {
                return res.status(404).json({ok: false, mensaje: 'LO SENTIMOS EL GRUPO DE TIENDA NO FUE ENCONTRADA EN TABLE MOVIMIENTO'});
            }

            let respuesta = [];

            for (let d = 0; d < respuesta2.length; d++) {
                
                respuesta4.filter((t) => {
                    if (t.tienda == respuesta2[d].Tda) {
                        respuesta.push({id: respuesta2[d].id,
                            tienda: t.tienda, zona: t.zonaname, nombre: t.nombre,
                            sku: respuesta2[d].Codigointerno, stock: respuesta2[d].stock, precioetiqueta: respuesta2[d].precioetiqueta,
                            precioventa: respuesta2[d].precioventa
                        });
                    }
                })
                
            }

            if (respuesta.length <= 0) {
                return res.status(404).json({ok: false, mensaje: 'LO SENTIMOS SKU TABLE MOVIMIENTOS. NO ENCONTRADO EN GRUPO DE TIENDA DE USUARIO'});
            }

            let temp = {};
            let datos = [];
            for (let i in respuesta) {
                
                let concat = respuesta[i].sku + respuesta[i].tienda;
                
                if (typeof temp[concat] == 'undefined') {
                    temp[concat] = {
                        tienda: respuesta[i].tienda,
                        zona: respuesta[i].zona,
                        nombre: respuesta[i].nombre,
                        sku: respuesta[i].sku,
                        stock: 0,
                        precioetiqueta: respuesta[i].precioetiqueta,
                        precioventa: respuesta[i].precioventa
                    };
                }

                temp[concat].stock += respuesta[i].stock;

            }

            for (const i in temp) {
                datos.push({
                    tienda:temp[i].tienda,
                    zona:temp[i].zona,
                    nombre:temp[i].nombre,
                    sku:temp[i].sku,
                    stock: temp[i].stock,
                    precioetiqueta:temp[i].precioetiqueta,
                    precioventa:temp[i].precioventa
                });
            }
           
            return res.status(200).json({ok: true, data: datos});

        }

        const respuesta3 = await mdlTienda.findOne({tienda:tienda});
        if (respuesta3 == null) {
            return res.status(404).json({ok: false, mensaje: 'LO SENTIMOS LA TIENDA NO FUE ENCONTRADA'});
        }

        const respuesta4 = await mdlTienda.find({grupo:respuesta3.grupo});
        if (respuesta4.length <= 0) {
            return res.status(404).json({ok: false, mensaje: 'LO SENTIMOS EL GRUPO DE TIENDA NO FUE ENCONTRADA'});
        }

        let respuesta = [];

        for (let d = 0; d < respuestaTienda.length; d++) {
            
            respuesta4.filter((t) => {
                if (t.tienda == respuestaTienda[d].Tda) {
                    respuesta.push({tienda: t.tienda, zona: t.zonaname, nombre: t.nombre,
                        sku: respuestaTienda[d].Codigointerno, stock: respuestaTienda[d].stock,
                        precioetiqueta: respuestaTienda[d].precioetiqueta, precioventa: respuestaTienda[d].precioventa
                    });
                }
            })
            
        }

        if (respuesta.length <= 0) {
            return res.status(404).json({ok: false, mensaje: 'LO SENTIMOS SKU NO ENCONTRADO EN GRUPO DE TIENDA DE USUARIO'});
        }
        
        const respuesta2 = await mdlStockDiarioMov.find({Codigointerno:sku});
        if (respuesta2.length <= 0) {
            return res.status(200).json({ok: true, data: respuesta});
        }

        let datos = [];

        for (let i = 0; i < respuesta.length; i++) {
            
            let stockNew = 0;
            let resultStock = 0;
            respuesta2.filter((m) => {
                
                if (respuesta[i].tienda === m.Tda && respuesta[i].sku === m.Codigointerno) {
                    
                    resultStock += m.stock;
                    stockNew = respuesta[i].stock + resultStock;

                }else{
                    stockNew = respuesta[i].stock;
                }

            })

            datos.push({tienda: respuesta[i].tienda, zona: respuesta[i].zona, nombre: respuesta[i].nombre,
                sku: respuesta[i].sku, stock: stockNew, precioetiqueta: respuesta[i].precioetiqueta, precioventa: respuesta[i].precioventa
            });
        }

        res.status(200).json({ok: true, data: datos});
        
    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR AL LISTAR STOCK POR TIENDA VERIFICAR PARAMETROS DE ENVIO'});
        next(e);
    }

}

/*=================================
EXPORTANDO EL VALOR {}
===================================*/

module.exports = ctrStockDiarioIncial;