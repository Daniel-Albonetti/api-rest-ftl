'use strict'

const { model, Schema } = require('mongoose');

const canalVentaSchema = new Schema({

    producto: { type: Schema.ObjectId, ref: 'producto' },
    detalle_producto: { type: Schema.ObjectId, ref: 'detalle_producto' },
    sku: { type: String, maxlength: 11 },
    idcanalventa: { type: Number },
    canalventa: { type: String },
    stock: { type: Number },
    flag: { type: Number }

});

const CanalVenta = model('canal_venta', canalVentaSchema);

module.exports = CanalVenta;