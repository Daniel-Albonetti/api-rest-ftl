'use strict'

const path = require('path');

const { pool } = require(path.join(process.cwd(), 'config', 'database.js'));
require(path.join(process.cwd(), 'config', 'mongodb.js'));

const mdlDetalleProductoML = require(path.join(process.cwd(), 'models', 'mercado_libre', 'detalle_producto'));
const mdlProductoML = require(path.join(process.cwd(), 'models', 'mercado_libre', 'producto'));
const mdlCanalVenta = require(path.join(process.cwd(), 'models', 'mercado_libre', 'canal_venta'));

const mdlAnalyticAlways = require(path.join(process.cwd(), 'models', 'mercado_libre', 'analyticalways'));

/*==================================
PASAR PRODUCTOS SQL A MONGO
====================================*/

let mtdProductoML = async () => {

    const connect = await pool;
    const data = await connect.request()
    .query(`SELECT * FROM tb_productos WHERE flag_new=1`)
    if(data.recordset.length <= 0){
        return //console.log('ERROR! NO SE ENCONTRARON DATOS');
    }

    const producto =  data.recordset

    const detalle = await mdlDetalleProductoML.find();
    if (detalle.length <= 0) {
        return
    }

    for (let d = 0; d < producto.length; d++) {

        let idProdDet = 0;
        let idMongo = '';
        detalle.filter((a) => {

            if (a.id_prod_det == producto[d].id_prod_det) {

                idProdDet = a.id_prod_det;
                idMongo = `${a._id}`
            }

        })

        let productoDatos = {
            codigoDetalle: idProdDet,
            detalle_producto: idMongo,
            sku: producto[d].sku,
            talla: producto[d].talla.trim(),
            precio_etiqueta: producto[d].precio_venta,
            precio_oferta: producto[d].precio_dscto,
            fecha_ingreso_sku: producto[d].fec_ingreso_cd,
            stock: producto[d].stock,
            imagenes: JSON.parse(producto[d].imagen),
            estado: producto[d].estado,
            flag_upd: producto[d].flag_upd,
            producto_new: producto[d].flag_new
        }

        const productoMongo = await mdlProductoML.create(productoDatos);
        console.log('productoMongo', productoMongo._id);
        
    }

}

/*====================================
ACTUALIZAR IMAGENES
======================================*/

const mtdUpdImage = async () => {

    const connect = await pool;
    const data = await connect.request()
    .query(`SELECT * FROM tb_productos WHERE flag_new=0`)
    if(data.recordset.length <= 0){
        return //console.log('ERROR! NO SE ENCONTRARON DATOS');
    }

    const productoSql =  data.recordset

    const productoMongo = await mdlProductoML.find();

    for (let s = 0; s < productoSql.length; s++) {
        
        const producto = productoMongo.filter((m) => m.sku == productoSql[s].sku);

        if(producto.length > 0){

            let productoDatos = JSON.parse(productoSql[s].imagen);

            const canalVentaPro = await mdlProductoML.findOneAndUpdate({sku:productoSql[s].sku},{imagenes:productoDatos});
            console.log('canalVentaPro:', canalVentaPro.sku);

        }else{
            const skuUpdate = await connect.request()
            .query(`UPDATE tb_productos SET flag_new=5 WHERE sku=${productoSql[s].sku}`);
            console.log("updSql: ", skuUpdate.recordsets[0]);
        }

    }

}

/*====================================
TABLA CANAL DE VENTA
======================================*/

let mtdCanalVenta = async () => {

    const connect = await pool;
    const data = await connect.request()
    .query(`SELECT d.descripcion, d.marca, d.grupo, d.tipoart_des, d.principal_des, d.categoria_des, d.nom_web,
	d.modelo, d.color, p.id_prod_det, p.id_producto, p.sku, c.idcanalventa, c.canalventa, c.stock, c.flag, p.talla, p.precio_venta,
	p.precio_dscto, p.imagen, p.flag_upd, p.flag_new
	FROM tb_producto_ml_canalventa c
	INNER JOIN tb_productos p ON p.id_producto=c.id_producto
	INNER JOIN tb_productos_detalles d ON d.id_prod_det=p.id_prod_det
	WHERE c.idcanalventa=1 AND p.flag_new=0`)
    if(data.recordset.length <= 0){
        return //console.log('ERROR! NO SE ENCONTRARON DATOS');
    }

    const productoSql =  data.recordset;

    const productoMongo = await mdlProductoML.find();

    for (let s = 0; s < productoSql.length; s++) {
        
        const producto = productoMongo.filter((m) => m.sku == productoSql[s].sku);

        if(producto.length > 0){

            let productoDatos = {
                producto: producto[0]._id,
                detalle_producto: producto[0].detalle_producto,
                sku: productoSql[s].sku,
                idcanalventa: productoSql[s].idcanalventa,
                canalventa: productoSql[s].canalventa,
                stock: productoSql[s].stock,
                flag: productoSql[s].flag
            }
            const canalVentaPro = await mdlCanalVenta.create(productoDatos);
            console.log('canalVentaPro:', canalVentaPro.sku);

        }else{

            // console.log("No exite en Mongo: ", productoSql[s].sku);
            const skuUpdate = await connect.request()
            .query(`UPDATE tb_productos SET flag_new=5 WHERE sku=${productoSql[s].sku}`);
            console.log("updSql: ", skuUpdate.recordsets[0]);

        }

    }

};

/*====================================
ACTUALIZAR PRODUCTOS DE SQL A MONGO
======================================*/

let mtdActualizarProducto = async () => {

    const connect = await pool;
    const data = await connect.request()
    .query(`SELECT * FROM tb_productos WHERE flag_new=0`)
    //.query(`SELECT * FROM tb_productos WHERE flag_upd=1 and flag_new=0`)
    //.query(`SELECT * FROM tb_productos WHERE flag_upd=1 and flag_new != 2`);
    if(data.recordset.length <= 0){
        return //console.log('ERROR! NO SE ENCONTRARON DATOS');
    }

    const producto =  data.recordset

    for (let d = 0; d < producto.length; d++) {

        // console.log(producto[d].sku);
        const respuesta = await mdlProductoML.findOneAndUpdate({sku:producto[d].sku},
            { precio_etiqueta:producto[d].precio_venta, precio_oferta:producto[d].precio_dscto, flag_upd:1 });
            // { producto_new:6 });
        
        if (!respuesta) {
            
            const skuUpdate = await connect.request()
            .query(`UPDATE tb_productos SET flag_new=5 WHERE sku=${producto[d].sku}`);
            console.log("updSql: ", skuUpdate.recordsets[0]);

        }else{
            console.log('respuesta', respuesta.sku);
        }
        
    }


}

/*====================================
ACTUALIZAR STOCK CANAL DE VENTA
======================================*/

const mtdActualizarStockCanalVenta = async () => {

    const tiendaOficial = 1;

    const connect = await pool;
    const data = await connect.request()
    .query(`SELECT c.id_producto, c.idcanalventa, c.canalventa, c.sku, c.stock, c.flag, p.flag_new FROM tb_producto_ml_canalventa c
	INNER JOIN tb_productos p ON p.id_producto=c.id_producto
	WHERE p.flag_new=0 AND c.idcanalventa=${tiendaOficial}`)

    if(data.recordset.length <= 0){
        return //console.log('ERROR! NO SE ENCONTRARON DATOS');
    }

    const producto =  data.recordset;

    for (let d = 0; d < producto.length; d++) {

        const respuesta = await mdlCanalVenta.findOneAndUpdate({sku:producto[d].sku, idcanalventa:tiendaOficial},
            { stock:producto[d].stock, flag:1 });
        
        if (!respuesta) {
            
            const skuUpdate = await connect.request()
            .query(`UPDATE tb_productos SET flag_new=5 WHERE sku=${producto[d].sku}`);
            console.log("updSql: ", skuUpdate.recordsets[0]);

        }else{
            console.log('respuesta', respuesta.sku);
        }
        
    }

}

/*====================================
COMPROBAR PRODUCTOS QUE EXITENTES
======================================*/

let mtdProductosExistente = async() => {

    const respuesta = await mdlDetalleProductoML.find({}, {modelo:1, colores:1, temporada:1, categoria_desc:1});

    // for (let p = 0; p < respuesta.length; p++) {
        
    //     const connect = await pool;
    //     let colores = '';
    //     for (let i = 0; i < respuesta[p].colores.length; i++) {
    //         colores += respuesta[p].colores[i]+',';
    //     }
    //     let color = colores.slice(0, -1);

    //     const data = await connect.request()
    //     .query(`SELECT id_prod_det, modelo, color  FROM tb_productos_detalles WHERE modelo='${respuesta[p].modelo}' AND color='${color}' AND temporada='${respuesta[p].temporada}' AND categoria_des='${respuesta[p].categoria_desc}'`);
    //     if(data.recordset.length <= 0){
    //         // console.log(`ERROR! NO SE EL SKU: ${respuesta[p].id}`);
    //         const updModelo = await mdlDetalleProductoML.findByIdAndUpdate({_id:respuesta[p].id},{detalle_new:10});
    //         console.log('updModelo: ', updModelo._id);
    //     }else{

    //         const productoDetalle =  data.recordset;
    //         console.log('productoDetalle', productoDetalle[0].id_prod_det);
    //         const dataupd = await connect.request()
    //         .query(`UPDATE tb_productos_detalles SET flag_new=0 WHERE id_prod_det=${productoDetalle[0].id_prod_det}`);
    //         const productoUpd =  dataupd.rowsAffected;
    //         console.log('productoUpd', productoUpd);

    //     }
    // }

    // return;

    const connect = await pool;
    for (let i = 0; i < respuesta.length; i++) {

        const data = await connect.request()
        .query(`SELECT * FROM tb_productos WHERE sku=${respuesta[i].sku}`);
        if(data.recordset.length <= 0){
            console.log(`ERROR! NO SE EL SKU: ${respuesta[i].sku}`);
        }else{
            const producto =  data.recordset;
            console.log('producto', producto[0].sku);
            const dataupd = await connect.request()
            .query(`UPDATE tb_productos SET flag_new=0 WHERE sku=${producto[0].sku}`);
            const productoUpd =  dataupd.rowsAffected;
            console.log('productoUpd', productoUpd);
        }
    }

}

/*==================================
ACTUALIZAR PRODUCTOS NUEVOS
====================================*/

let mtdUpdNewProducto = async () => {

    const connect = await pool;
    const data = await connect.request()
    .query(`SELECT * FROM tb_productos WHERE flag_new=5`);
    if(data.recordset.length <= 0){
        return //console.log('ERROR! NO SE ENCONTRARON DATOS');
    }

    const producto =  data.recordset

    for (let d = 0; d < producto.length; d++) {

        const respuesta = await mdlProductoML.findOneAndUpdate({sku:producto[d].sku},
            {precio_etiqueta:producto[d].precio_venta, precio_oferta:producto[d].precio_dscto, producto_new:1});

        console.log('respuesta', respuesta._id);
        
    }

}

/*================================
UPDATE PRODUCT DELETE
==================================*/

let mtdDeleteProducto = async () => {

    const connect = await pool;
    const data = await connect.request()
    .query(`SELECT sku, flag_del FROM tb_productos WHERE flag_del=1`);

    if(data.recordset.length <= 0){
        return //console.log('ERROR! NO SE ENCONTRARON DATOS');
    }

    const producto =  data.recordset
    for (let d = 0; d < producto.length; d++) {
        
        const respuesta = await mdlProductoML.findOneAndUpdate({sku:producto[d].sku},
            {producto_new:producto[d].flag_del});

        console.log('respuesta', respuesta._id);
        
    }

}

/*===============================
ANALYTIC ALWAYS
=================================*/

let mtdAnalyticAlways = async () => {

    const connect = await pool;
    const data = await connect.request()
    .query(`SELECT TOP 20 p.sku, p.precio_venta, p.precio_dscto, p.imagen, p.stock, p.talla, d.capellada_desc, d.marca, d.modelo, d.color, d.categoria_des, d.tipoart_des, d.temporada, d.nom_web
        FROM tb_productos p
        INNER JOIN tb_productos_detalles d ON p.id_prod_det=d.id_prod_det`);

    if(data.recordset.length <= 0) return
    const producto =  data.recordset

    for (let s = 0; s < producto.length; s++) {

        let productoAnalytic = {
            ProductCode : producto[s].sku,
            RootCode: '70908H052040',
            EAN: '',
            Description: producto[s].marca+' '+producto[s].modelo,
            Cost: producto[s].precio_venta,
            Price: producto[s].precio_venta,
            Categorization: {
                Marca: producto[s].marca,
                Modelo: producto[s].modelo,
                Color: producto[s].color,
                Genero: producto[s].nom_web,
                ArticuloDesc: producto[s].tipoart_des,
                Temporada: producto[s].temporada,
                NombreWeb: producto[s].nom_web,
            },
            MinimumOrder: 0,
            OrdMultiplo: 0,
            thumbnailUrl: 'http://passarela.info:8080/asistencia/imagenesproducto/3x/717_101249_00010007_052_1_041_001.jpg',
            Size: producto[s].talla,
        }
        
        const productoMongo = await mdlAnalyticAlways.create(productoAnalytic);
        console.log('productoAnality: ', productoMongo._id);

    }

}

module.exports = {
    mtdProductoML,
    mtdActualizarProducto,
    mtdUpdNewProducto,
    mtdDeleteProducto,
    mtdAnalyticAlways,
    mtdProductosExistente,
    mtdCanalVenta,
    mtdUpdImage,
    mtdActualizarStockCanalVenta
}