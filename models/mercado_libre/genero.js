'use strict'

const { model, Schema } = require('mongoose');

const genero_integracionSchema = new Schema({

    id_genero: { type: String, maxlength: 20 },
    descripcion: { type: String, maxlength: 200 }

})

const genero_integracion = model('genero', genero_integracionSchema);

module.exports = genero_integracion