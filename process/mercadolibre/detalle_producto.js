'use strict'

const path = require('path');

const { pool } = require(path.join(process.cwd(), 'config', 'database.js'));
require(path.join(process.cwd(), 'config', 'mongodb.js'));

const mdlDetalleProductoML = require(path.join(process.cwd(), 'models', 'mercado_libre', 'detalle_producto'));
const mdlgeneroML = require(path.join(process.cwd(), 'models', 'mercado_libre', 'genero'));

let mtdDetalle_Producto_ML = async () => {

    const connect = await pool;
    const data = await connect.request()
    .query(`SELECT id_prod_det, descripcion, marca, modelo, temporada, anio, unidad_med, estilo_des, id_genero,
        categoria_des, grupocat, nom_web, tipoart_des, principal_des, grupo, color, flag_new
        FROM tb_productos_detalles WHERE flag_new in (1) ORDER BY id_prod_det DESC`);
    if(data.recordset.length <= 0){
        return //console.log('ERROR! NO SE ENCONTRARON DATOS');
    }

    const datos =  data.recordset

    const generoML = await mdlgeneroML.find({});
    if (generoML.length <= 0) {
        return
    }

    for (let d = 0; d < datos.length; d++) {

        let objectGenero = '5dbb7eab02529b22f812c6e9';
        generoML.filter((x) => {

            if (datos[d].id_genero === x.id_genero) {
                objectGenero = x._id;
            }

        })
        
        let detalleProducto = {
            genero: `${objectGenero}`,
            id_prod_det: datos[d].id_prod_det,
            descripcion: datos[d].descripcion,
            marca: datos[d].marca,
            modelo: datos[d].modelo,
            temporada: datos[d].temporada,
            anio: `${datos[d].anio}`,
            unidad_md: datos[d].unidad_med,
            estilo_desc: datos[d].estilo_des.trim(),
            categoria_desc: datos[d].categoria_des,
            grupo_cat: datos[d].grupocat,
            nombre_web: datos[d].nom_web,
            tipo_articulo_desc: datos[d].tipoart_des,
            articulo_principal_desc: datos[d].principal_des,
            articulo_grupo: datos[d].grupo,
            colores: datos[d].color.trim().split(","),
            detalle_new: datos[d].flag_new
        }

        const detalleProductoRes = await mdlDetalleProductoML.create(detalleProducto);
        console.log('detalleProductoResMDB', detalleProductoRes._id);
                            
    }

}

module.exports = {
    mtdDetalle_Producto_ML
}