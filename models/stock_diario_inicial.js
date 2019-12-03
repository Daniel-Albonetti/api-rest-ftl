/*===================================
REQUIRIENDO MONGOOSE
=====================================*/

const { model, Schema } = require('mongoose');

const stockdiarioinicialSchema = new Schema({

    Tda: { type: String, maxlength: 10, required: true },
    Codigointerno: { type: String, maxlength: 20, required: true },
    stock: { type: Number },
    precioetiqueta: { type: Number, required: true },
    precioventa: { type: Number, required: true }

})

const stockdiarioinicial = model('stock_inicial', stockdiarioinicialSchema);

module.exports = stockdiarioinicial;