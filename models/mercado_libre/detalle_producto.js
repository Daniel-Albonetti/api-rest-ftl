'use strict'

const { model, Schema } = require('mongoose');

const detalle_productoSchema = new Schema({

    genero: { type: Schema.ObjectId, ref: 'genero' },
    id_prod_det: { type: Number, required: true },
    descripcion: { type: String, maxlength: 255 },
    marca: { type: String, maxlength: 155, required: true },
    modelo: { type: String, maxlength: 155 },
    temporada: { type: String, maxlength: 255, required:true },
    anio: { type: Date, required: true },
    unidad_md: { type: String, maxlength: 50 },
    estilo_desc: { type: String, maxlength: 255 },
    categoria_desc: { type: String, maxlength: 255 },
    grupo_cat: { type: String, maxlength: 150 },
    nombre_web: { type: String, maxlength: 200 },
    tipo_articulo_desc: { type: String, maxlength: 255 },
    articulo_principal_desc: { type: String, maxlength: 100 },
    articulo_grupo: { type: String, maxlength: 255 },
    colores: [ String ],
    detalle_new: { type: Number }

})

const Detalle_Producto = model('detalle_producto', detalle_productoSchema);

module.exports = Detalle_Producto;