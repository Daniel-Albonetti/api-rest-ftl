'use strict'

const fetch = require('node-fetch');
const path = require('path');

//const { pool } = require(path.join(process.cwd(), 'config', 'database.js'));
require(path.join(process.cwd(), 'config', 'mongodb.js'));

const mdlProductoML = require(path.join(process.cwd(), 'models', 'mercado_libre', 'producto'));
const mdlPublicacionesMl = require(path.join(process.cwd(), 'models', 'mercado_libre', 'publicaciones_ML'));

/*===============================
TOKEN DESARROLLO
=================================*/

let token = 'APP_USR-2497956263375715-122321-76d98a10d30e1554062fbed99507eb0b-472424138';

const { agruparPorGenero,
    agruparPorDescripcion,
    agruparPorColor
} = require(path.join(process.cwd(), 'helpers', 'agrupar'));

let mtdPublicacionesML = async () => {

    try {
        
        const respuesta = await mdlProductoML.find({producto_new:1})
        .populate({ path: 'detalle_producto', match: {articulo_grupo: 'Calzados'}, select: { modelo:1, marca:1,
            descripcion:1, articulo_grupo:1, nombre_web:1, colores:1, articulo_principal_desc:1, imagenes:1 },
            populate: { path: 'genero', select: { descripcion:1, id_genero:1 }}
        })
        // .limit(100)
        if (respuesta.length <= 0) {
            return console.log('LO SENTIMOS NO HAY PRODUCTOS NUEVOS PARA SUBIR');
        }

        let datosGenero = agruparPorDescripcion(respuesta);
        for (let i = 0; i < datosGenero.length; i++) {
            datosGenero[i] = agruparPorGenero(datosGenero[i]);
            for (let d = 0; d < datosGenero[i].length; d++) {
                datosGenero[i][d] = agruparPorColor(datosGenero[i][d])
            }
        }

        let productoSubirJson = datosGenero;

        if (productoSubirJson.length > 0) {

            for (let d = 0; d < productoSubirJson.length; d++) {

                //PUBLICACIONES
                for (let p = 0; p < productoSubirJson[d].length; p++) {
                    
                    let skuProducto = [];

                    //POR COLOR
                    let variacionesPublicacion = [];
                    let imagenProducto = [];

                    let publiTitulo = '';
                    let publiCategoria = '';
                    let publiDescription = '';
                    
                    let publicMarca = '';
                    let publiNombreWeb = '';
                    let publiModelo = '';

                    for (let c = 0; c < productoSubirJson[d][p].length; c++) {
                        
                        //VARIACIONES
                        let variacionesColores = [];
                        for (let v = 0; v < productoSubirJson[d][p][c].length; v++) {

                            skuProducto.push({skuproducto:productoSubirJson[d][p][c][v].sku, objectproducto:productoSubirJson[d][p][c][v]._id});

                            let imagenesContent = productoSubirJson[d][p][c][0].imagenes;
                            if (productoSubirJson[d][p][c][0].imagenes.length <= 0) {
                                imagenesContent = ["https://www.navarromontes.com/img/p/es-default-large_default.jpg"];
                            }

                            variacionesColores.push({
                                talla: productoSubirJson[d][p][c][v].talla,
                                color: productoSubirJson[d][p][c][v].detalle_producto.colores.toString(),
                                precio_etiqueta: productoSubirJson[d][p][c][v].precio_etiqueta,
                                // available_quantity: productoSubirJson[d][p][v].stock,
                                stock: 1,
                                sku: productoSubirJson[d][p][c][v].sku,
                                imagenes: imagenesContent
                            })
                            
                        }

                        variacionesPublicacion.push(variacionesColores);

                        let groupImagenes = ["https://www.navarromontes.com/img/p/es-default-large_default.jpg"];
                        for (let img = 0; img < productoSubirJson[d][p][c][0].imagenes.length; img++) {

                            if (productoSubirJson[d][p][c][0].imagenes.length > 0) {
                                groupImagenes = productoSubirJson[d][p][c][0].imagenes[img];
                            }
                            imagenProducto.push({source: groupImagenes});

                        }

                        //DETALLE DE COLORES
                        publiTitulo = productoSubirJson[d][p][c][0].detalle_producto.descripcion;
                        publiCategoria = productoSubirJson[d][p][c][0].detalle_producto.genero.id_genero;
                        publiDescription = {plain_text: `Adquiere los modelos exclusivos que la marca ${productoSubirJson[d][p][c][0].detalle_producto.marca} trae para ti en su colección de ${productoSubirJson[d][p][c][0].detalle_producto.articulo_grupo} para ${productoSubirJson[d][p][c][0].detalle_producto.nombre_web}`}
                        publicMarca = productoSubirJson[d][p][c][0].detalle_producto.marca;
                        publiNombreWeb = productoSubirJson[d][p][c][0].detalle_producto.nombre_web;
                        publiModelo = productoSubirJson[d][p][c][0].detalle_producto.modelo;
                    }

                    // console.log("variacionesPublicacion: ", variacionesPublicacion);

                    let datosVariationPublication = [];
                    for (let h = 0; h < variacionesPublicacion.length; h++) {
                        
                        for (let y = 0; y < variacionesPublicacion[h].length; y++) {
                            
                            datosVariationPublication.push({
                                attribute_combinations:[
                                    { name: "Talla", value_name: variacionesPublicacion[h][y].talla },
                                    { id: "Color", value_name: variacionesPublicacion[h][y].color }
                                ],
                                price: variacionesPublicacion[h][y].precio_etiqueta,
                                // available_quantity: productoSubirJson[d][p][v].stock,
                                available_quantity: 1,
                                seller_custom_field: variacionesPublicacion[h][y].sku,
                                sold_quantity: 0,
                                picture_ids: variacionesPublicacion[h][y].imagenes
                            })
                            
                        }
                        
                    }

                    let jsonPublicacion = {
                        site_id:"MPE",
                        // official_store_id: 183,
                        title: publiTitulo,
                        category_id: publiCategoria,
                        currency_id:"PEN",
                        condition:"new",
                        buying_mode:"buy_it_now",
                        listing_type_id:"gold_special",
                        description: publiDescription,
                        attributes: [
                            { id:"BRAND", value_name: publicMarca },
                            { id:"GENDER", value_id: publiNombreWeb },
                            { id:"MODEL", value_name: publiModelo },
                            { id:"ITEM_CONDITION", value_id:"2230284" },
                            { id:"SHIPMENT_PACKING", value_id:"7435892" }
                        ],
                        sale_terms:[
                            { id: "WARRANTY_TYPE", value_id: "6150835" }
                        ],
                        pictures: imagenProducto,
                        tags: [ "immediate_payment" ],
                        shipping: {
                            mode: "custom",
                            local_pick_up: false,
                            free_shipping: false,
                            costs: [
                                { description: "Distritos de Lima", cost: "10" },
                                { description: "Provincia", cost: "20" }
                            ]
                        },
                        variations: datosVariationPublication
                    }

                    //console.log("jsonPublicacion: ", jsonPublicacion);

                    fetch(`https://api.mercadolibre.com/items?access_token=${token}`,{
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(jsonPublicacion)
                    })
                    .then(res => res.json())
                    .then(data => {

                        console.log('resMercadoLibre: ', data.id);

                        let variaciones = [];
                        for (let d = 0; d < data.variations.length; d++) {

                            let attributeVariacion = [];
                            for (let y = 0; y < data.variations[d].attribute_combinations.length; y++) {

                                attributeVariacion.push({
                                    id: data.variations[d].attribute_combinations[y].id,
                                    name: data.variations[d].attribute_combinations[y].name,
                                    value_id: data.variations[d].attribute_combinations[y].value_id,
                                    value_name: data.variations[d].attribute_combinations[y].value_name
                                })

                            }

                            let skuProductoMl = '';
                            skuProducto.filter((a) => {
                                                                                    
                                if (a.skuproducto == data.variations[d].seller_custom_field) {
                                    skuProductoMl = a.objectproducto;
                                }
            
                            })

                            variaciones.push({

                                producto: skuProductoMl,
                                id: data.variations[d].id.toString(),
                                attribute_combinations: attributeVariacion,
                                price: data.variations[d].price,
                                available_quantity: data.variations[d].available_quantity,
                                seller_custom_field: data.variations[d].seller_custom_field,
                                sold_quantity: data.variations[d].sold_quantity,
                                picture_ids: data.variations[d].picture_ids

                            })

                        }

                        let publicaciones = {

                            id_publicacion: data.id,
                            site_id: data.site_id,
                            title: data.title,
                            category_id: data.category_id,
                            currency_id: data.currency_id,
                            condition: data.condition,
                            buying_mode: data.buying_mode,
                            listing_type_id: data.listing_type_id,
                            description: {
                                plain_text: jsonPublicacion.description.plain_text,
                            },
                            attributes: jsonPublicacion.attributes,
                            warranty: data.warranty,
                            pictures: data.pictures,
                            shipping: {
                                mode: jsonPublicacion.shipping.mode,
                                local_pick_up: data.shipping.local_pick_up,
                                free_shipping: data.shipping.free_shipping,
                                costs: jsonPublicacion.shipping.costs
                            },
                            permalink: data.permalink,
                            variations: variaciones,
                            date_created: data.date_created

                        }

                        // REGISTRANDO PUBLICACIONES EN EL MONGO

                        fetch(`http://localhost:8000/api/publicaciones-ml/registrar`,{
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(publicaciones)
                        })
                        .then(res => res.json())
                        .then(result => {
                            console.log('result', result._id);

                        })

                        //const result = await mdlPublicacionesMl.create(publicaciones);

                        //console.log("PublicaiconesMongo: ", result._id);

                        // if (result) {

                        //     // skuproducto
                        //     for (let l = 0; l < skuProducto.length; l++) {
                                
                        //         const respuesta = await mdlProductoML.findOneAndUpdate({sku:skuProducto[l].skuproducto},{producto_new:0});
                        //         //console.log('respuesta', respuesta._id);
                                
                        //     }
                        

                        // }
                    })
                    .catch(err => console.log(err));
                }

            }

        }else{
            console.log('productoSubirJson', productoSubirJson);
        }


    } catch (e) {
        console.log('ERROR AL SUBIR PUBLICACION:', e);
    }

}

module.exports = {

    mtdPublicacionesML

}