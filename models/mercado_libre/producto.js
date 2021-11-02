'use strict'

const { model, Schema } = require('mongoose');

const productoSchema = new Schema({

    detalle_producto: { type: Schema.ObjectId, ref: 'detalle_producto' },
    sku: { type: String, maxlength: 11 },
    talla: { type: String, maxlength: 100 },
    precio_etiqueta: { type: Number },
    precio_oferta: { type: Number },
    fecha_ingreso_sku: { type: Date },
    stock: { type: Number },
    imagenes: [ String ],
    estado: { type: String, maxlength: 255 },
    flag_upd: { type: Number, required: true },
    producto_new: { type: Number },


});

const Producto = model('producto', productoSchema);

module.exports = Producto;