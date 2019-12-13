'use strict'

const path = require('path');

const ctrProductoApp = {};
const mdlProductoApp = require(path.join(process.cwd(), 'models', 'xamari', 'productos_app'));

const mdlStockDiarioIncial = require(path.join(process.cwd(), 'models', 'xamari', 'stock_diario_inicial'));
const mdlStockDiarioMov = require(path.join(process.cwd(), 'models', 'xamari', 'stock_diario_mov'));

const { groupBy } = require(path.join(process.cwd(), 'helpers', 'function_daniel'));

/*==========================
METOGO POST | /lista-curva
============================*/

ctrProductoApp.listaCurva = async (req, res, next) => {

    try {

        let sku = req.body.sku,
            tienda = req.body.tienda;

        if (sku != undefined && sku != "") {

            const respuesta = await mdlProductoApp.find({$or:[ {Codigointerno: sku}, {Modelo:new RegExp(sku,'i')}, {Modelo:sku} ]})
            .sort({Talla:1});
            
            if (respuesta.length <= 0) {
                return res.status(404).json({ok: false, mensaje: 'ERROR! CATALOGO DE PRODUCTO NO ENCONTRADO EN PRODUCTO APP'});
            }

            if (respuesta.length == 1) {

                //console.log("ESTAMOS BUSCANDO POR TODA LA DESCRIPCION");

                /*=========================
                INICIO POR SKU
                ===========================*/

                const respuesta2 = await mdlProductoApp.find({Categoria:respuesta[0].Categoria, Marca:respuesta[0].Marca, Modelo:respuesta[0].Modelo})
                .sort({Talla:1})
                if (respuesta2.length <= 0) {
                    return res.status(404).json({ok: false, mensaje: 'ERROR NO SE ENCONTRARON LA FAMILIA DEL SKU'});
                }

                let datosSkuCurva = [];
                for (let z = 0; z < respuesta2.length; z++) {
                    datosSkuCurva.push(respuesta2[z].Codigointerno);
                }

                // CONSULTANDO EL STOCK INICIAL
                const resultStockInicial = await mdlStockDiarioIncial.find({Codigointerno:{ $in: datosSkuCurva}, Tda:tienda });
                if (resultStockInicial.length <= 0) {

                    //console.log("ESTAMOS EN MOVIMIENTOS");

                    //return res.status(404).json({ok: false, mensaje: `¡ERROR! SKU EN INICIAL NO ENCONTRADOS EN TIENDA: ${tienda}`});
                    //SINO EXITE EN EL STOCK INICIAL EN TIENDA PREGUNTAR EN EL STOCK DE MOVIMIENTOS EN TIENDA
                    
                    const resultSctockMov = await mdlStockDiarioMov.find({Codigointerno:{$in: datosSkuCurva}, Tda:tienda });
                    if (resultSctockMov.length <= 0) {
                        return res.status(404).json({ok: false, mensaje: `ERROR! PRODUCTO NO EXITE EN INICIAL NI EN MOVIMIENTO EN TIENDA: ${tienda}`});
                    }


                    let datosMovSumStock = {};
                    datosMovSumStock = groupBy(resultSctockMov, 'Codigointerno');

                    let datosFinSoloMov = [];
                    for (let t = 0; t < respuesta2.length; t++) {

                        if(datosMovSumStock[respuesta2[t].Codigointerno]){
                            datosFinSoloMov.push(datosMovSumStock[respuesta2[t].Codigointerno]);
                        }
                        
                    }

                    //console.log("respuesta2:", respuesta2);

                    let datosDetalleSumMovFinal = [];
                    respuesta2.filter((dp) => {

                        datosFinSoloMov.filter((dsm) => {

                            if (dp.Codigointerno === dsm.Codigointerno) {
                                datosDetalleSumMovFinal.push({
                                    tienda: dsm.Tda,
                                    codigointerno: dsm.Codigointerno,
                                    descripcion: dp.Descripcion,
                                    categoria: dp.Categoria,
                                    modelo: dp.Modelo,
                                    stock: dsm.stock,
                                    marca: dp.Marca,
                                    color: dp.Color,
                                    talla: dp.Talla,
                                    precioetiqueta: dsm.precioetiqueta,
                                    precioventa: dsm.precioventa,
                                    urlimagen: "http://"+dp.urlimagen
                                });
                            }

                        })

                    })


                    // MOSTRANDO EL RESULTADO DE STOCK EN MOVIMIENTO YA QUE NO SE ENCONTRO EN EL INICIAL
                    return res.status(200).json({ok: true, data: datosDetalleSumMovFinal});

                }

                // MOSTRANDO EL STOCK INICIAL CON EL DETALLE DE SKU

                let resultstockIni = [];
                for (let y = 0; y < respuesta2.length; y++) {

                    resultStockInicial.filter((si) => {
                        
                        if (respuesta2[y].Codigointerno === si.Codigointerno) {
                            
                            resultstockIni.push({
                                tienda: si.Tda,
                                codigointerno: si.Codigointerno,
                                descripcion: respuesta2[y].Descripcion,
                                categoria: respuesta2[y].Categoria,
                                modelo: respuesta2[y].Modelo,
                                stock: si.stock,
                                marca: respuesta2[y].Marca,
                                color: respuesta2[y].Color,
                                talla: respuesta2[y].Talla,
                                precioetiqueta: si.precioetiqueta,
                                precioventa: si.precioventa,
                                urlimagen: "http://"+respuesta2[y].urlimagen
                            });
        
                        }
        
                    })
        
                }

                // SI EXITE DATOS EN EL STOCK INICIAL CONSULTAMOS A MOVIMIENTOS 
                let datosSkuCurvaTienda = [];
                for (let o = 0; o < resultstockIni.length; o++) {
                    datosSkuCurvaTienda.push(resultstockIni[o].codigointerno)
                }

                // CONSULTANDO EL STOCK DE MOVIMIENTOS
                const resultStockMov = await mdlStockDiarioMov.find({Codigointerno:{$in: datosSkuCurvaTienda}, Tda:tienda });
                
                // SI EN LOS MOVIMIENTOS NO EXITE LOS SKU'S, MOSTRAMOS EL STOCK INICIAL
                if (resultStockMov.length <= 0) {

                    return res.status(200).json({ok:true, data: resultstockIni});
                    
                }

                let datosStockIniMov = [];

                resultstockIni.filter((w) => {

                    let stockNew = w.stock;
                    let resultStock = 0;
                    resultStockMov.filter((m) => {
                        
                        if ( w.tienda === m.Tda && w.codigointerno === m.Codigointerno) {
                        
                            resultStock += m.stock;
                            stockNew = w.stock + resultStock;

                        }

                    })

                    datosStockIniMov.push({tienda: w.tienda, codigointerno: w.codigointerno,
                        descripcion: w.descripcion, categoria: w.categoria,
                        modelo: w.modelo, stock: stockNew, marca: w.marca, color: w.color,
                        talla: w.talla, precioetiqueta: w.precioetiqueta,
                        precioventa: w.precioventa, urlimagen: w.urlimagen
                    });

                })

                return res.status(200).json({ok:true, data: datosStockIniMov});

                /*=========================
                FIN POR SKU
                ===========================*/
                
            }

            /*=========================
            INICIO POR MODELO
            ===========================*/

            const respuesta2 = respuesta;

            if (respuesta2.length <= 0) {
                return res.status(404).json({ok: false, mensaje: 'ERROR NO SE ENCONTRARON LA FAMILIA DEL SKU'});
            }

            let datosSkuCurva = [];
            for (let z = 0; z < respuesta2.length; z++) {
                datosSkuCurva.push(respuesta2[z].Codigointerno);
            }

            // CONSULTANDO EL STOCK INICIAL
            const resultStockInicial = await mdlStockDiarioIncial.find({Codigointerno:{ $in: datosSkuCurva}, Tda:tienda });
            if (resultStockInicial.length <= 0) {

                //return res.status(404).json({ok: false, mensaje: `¡ERROR! SKU EN INICIAL NO ENCONTRADOS EN TIENDA: ${tienda}`});
                //SINO EXITE EN EL STOCK INICIAL EN TIENDA PREGUNTAR EN EL STOCK DE MOVIMIENTOS EN TIENDA
                
                const resultSctockMov = await mdlStockDiarioMov.find({Codigointerno:{$in: datosSkuCurva}, Tda:tienda });
                if (resultSctockMov.length <= 0) {
                    return res.status(404).json({ok: false, mensaje: `ERROR! PRODUCTO NO EXITE EN INICIAL NI EN MOVIMIENTO EN TIENDA: ${tienda}`});
                }


                let datosMovSumStock = {};
                datosMovSumStock = groupBy(resultSctockMov, 'Codigointerno');

                let datosFinSoloMov = [];
                for (let t = 0; t < respuesta2.length; t++) {

                    if(datosMovSumStock[respuesta2[t].Codigointerno]){
                        datosFinSoloMov.push(datosMovSumStock[respuesta2[t].Codigointerno]);
                    }
                    
                }

                let datosDetalleSumMovFinal = [];
                respuesta2.filter((dp) => {

                    datosFinSoloMov.filter((dsm) => {

                        if (dp.Codigointerno === dsm.Codigointerno) {
                            datosDetalleSumMovFinal.push({
                                tienda: dsm.Tda,
                                codigointerno: dsm.Codigointerno,
                                descripcion: dp.Descripcion,
                                categoria: dp.Categoria,
                                modelo: dp.Modelo,
                                stock: dsm.stock,
                                marca: dp.Marca,
                                color: dp.Color,
                                talla: dp.Talla,
                                precioetiqueta: dsm.precioetiqueta,
                                precioventa: dsm.precioventa,
                                urlimagen: "http://"+dp.urlimagen
                            });
                        }

                    })

                })


                // MOSTRANDO EL RESULTADO DE STOCK EN MOVIMIENTO YA QUE NO SE ENCONTRO EN EL INICIAL
                return res.status(200).json({ok: true, data: datosDetalleSumMovFinal});

            }

            // MOSTRANDO EL STOCK INICIAL CON EL DETALLE DE SKU

            let resultstockIni = [];
            for (let y = 0; y < respuesta2.length; y++) {

                resultStockInicial.filter((si) => {
                    
                    if (respuesta2[y].Codigointerno === si.Codigointerno) {
                        
                        resultstockIni.push({
                            tienda: si.Tda,
                            codigointerno: si.Codigointerno,
                            descripcion: respuesta2[y].Descripcion,
                            categoria: respuesta2[y].Categoria,
                            modelo: respuesta2[y].Modelo,
                            stock: si.stock,
                            marca: respuesta2[y].Marca,
                            color: respuesta2[y].Color,
                            talla: respuesta2[y].Talla,
                            precioetiqueta: si.precioetiqueta,
                            precioventa: si.precioventa,
                            urlimagen: "http://"+respuesta2[y].urlimagen
                        });
    
                    }
    
                })
    
            }

            // SI EXITE DATOS EN EL STOCK INICIAL CONSULTAMOS A MOVIMIENTOS 
            let datosSkuCurvaTienda = [];
            for (let o = 0; o < resultstockIni.length; o++) {
                datosSkuCurvaTienda.push(resultstockIni[o].codigointerno)
            }

            // CONSULTANDO EL STOCK DE MOVIMIENTOS
            const resultStockMov = await mdlStockDiarioMov.find({Codigointerno:{$in: datosSkuCurvaTienda}, Tda:tienda });
            
            // SI EN LOS MOVIMIENTOS NO EXITE LOS SKU'S, MOSTRAMOS EL STOCK INICIAL
            if (resultStockMov.length <= 0) {

                return res.status(200).json({ok:true, data: resultstockIni});
                
            }

            let datosStockIniMov = [];

            resultstockIni.filter((w) => {

                let stockNew = w.stock;
                let resultStock = 0;
                resultStockMov.filter((m) => {
                    
                    if ( w.tienda === m.Tda && w.codigointerno === m.Codigointerno) {
                    
                        resultStock += m.stock;
                        stockNew = w.stock + resultStock;

                    }

                })

                datosStockIniMov.push({tienda: w.tienda, codigointerno: w.codigointerno,
                    descripcion: w.descripcion, categoria: w.categoria,
                    modelo: w.modelo, stock: stockNew, marca: w.marca, color: w.color,
                    talla: w.talla, precioetiqueta: w.precioetiqueta,
                    precioventa: w.precioventa, urlimagen: w.urlimagen
                });

            })

            return res.status(200).json({ok:true, data: datosStockIniMov});

            /*=========================
            FIN POR MODELO
            ===========================*/

        }

        return res.status(404).json({ok: false, mensaje: "LO SENTIMOS TIENE QUE INGRESAR UN SKU"});

    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR AL LISTAR EL STOCK INICIAL'});
        next(e);
    }

}

/*======================================
EXPORTANDO EL VALOR DE {}
========================================*/

module.exports = ctrProductoApp;