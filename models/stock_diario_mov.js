/*============================
REQUIRIENDO MONGOOSE
==============================*/

const { model, Schema } = require('mongoose');

const stockdiariomovSchema = new Schema({

    id: { type: Number, required: true },
    Tda: { type: String, maxlength: 3, required: true },
    Codigointerno: { type: String, maxlength: 11, required: true },
    stock: { type: Number, required: true },
    precioetiqueta: { type: Number, required: true },
    precioventa: { type: Number, required: true }

})

const stockdiariomov = model('stockdiariomov', stockdiariomovSchema);

module.exports = stockdiariomov;