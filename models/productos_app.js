/*===================================
REQUIRIENDO MONGOOSE
=====================================*/

const { model, Schema } = require('mongoose');

const productoAppSchema = new Schema({

    Codigointerno: { type: String, maxlength:20, required: true },
    Categoria: { type: String, maxlength: 50 },
    Marca: { type: String, maxlength: 100 },
    Modelo: { type: String, required: true },
    Descripcion: { type: String, required: true },
    urlimagen: { type: String },

})

const productoApp = model('productos_app', productoAppSchema);

module.exports = productoApp;