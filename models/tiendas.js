/*================================
REQUIRIENDO MONGOOSE
==================================*/

const { model, Schema } = require('mongoose');

const tiendaSchema = new Schema({

    grupo: { type: Number, required: true },
    zonaname: { type: String, maxlength: 100 },
    tienda: { type: String, maxlength: 10, required: true, unique: true },
    nombre: { type: String, maxlength: 255 }

})

const tienda = model('tienda', tiendaSchema);

module.exports = tienda;