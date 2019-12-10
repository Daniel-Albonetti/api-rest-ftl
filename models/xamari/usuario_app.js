'use strict'

const { model, Schema } = require('mongoose');

let perfilValidos = {
    values: ['ADMIN_PERFIL', 'USER_PERFIL'],
    message: '{VALUE} NO ES UN PERFIL VALIDO'
}

const usuario_appSchema = new Schema({

    codigo: { type: String, maxlength: 10, required: true, unique: true },
    clave: { type: String, required: true },
    nombres: { type: String, maxlength: 100, required: true },
    dni: { type: String, maxlength: 20, required: true, unique: true },
    tienda: { type: String, maxlength: 10, required: true },
    perfil: { type: String, default: 'USER_PERFIL', enum: perfilValidos },
    estado: { type: Boolean }

})

const usuario_app = model('usuario_app', usuario_appSchema);

module.exports = usuario_app;