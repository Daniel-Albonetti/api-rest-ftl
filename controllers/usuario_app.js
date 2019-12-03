/*====================================
REQUIRIENDO EL MODELO DE USUARIO
======================================*/

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ctrUsuarioApp = {};
const mdlUsuarioApp = require('../models/usuario_app');
const mdlTienda = require('../models/tiendas');

/*============================
METOGO POST | /registrar
==============================*/

ctrUsuarioApp.crearUsuarioApp = async (req, res, next) => {

    try {

        if (!/^([0-9])*$/.test(req.body.dni)){
            return res.status(404).json({ok: false, mensaje: "LO SENTIMOS DNI NO CONTIENE LETRAS"});
        }

        const respuesta1 = await mdlTienda.findOne({tienda:req.body.tienda});
        if (respuesta1 == null) {
            return res.status(404).json({ok: false, mensaje: "LO SENTIMOS TIENDA INGRESADO NO IDENTIFICADO"});    
        }

        req.body.clave = await bcryptjs.hash(req.body.clave, 10);
        const respuesta = await mdlUsuarioApp.create(req.body);
        const codigoUser = respuesta.codigo;
        res.status(200).json({ok: true, codigoUser});
        
    } catch (e) {
        if (e.code == 11000) {
            res.status(500).json({ok: false, mensaje: `LO SENTIMOS EL DATOS ${JSON.stringify(e.keyValue)} YA EXITE`});
        }else{
            res.status(500).json({ok: false, mensaje: 'ERROR AL CREAR USUARIO APP'});
        }
        next(e);
    }

}

/*=========================
METODO POST | /login-user
===========================*/

ctrUsuarioApp.loginUsuarioApp = async (req, res, next) => {

    try {

        const respuesta = await mdlUsuarioApp.findOne({codigo:req.body.codigo, estado:true})
        if (respuesta.estado != true) {
            return res.status(200).json({ok: false, mensaje:"EL USUARIO NO TIENE ACCESO"})
        }
        if (!respuesta) {
            return res.status(404).json({ok: false, mensaje: 'EL USUARIO NO EXISTE'});
        }

        if(!bcryptjs.compareSync(req.body.clave, respuesta.clave)){
            return res.status(404).json({ok: false, mensaje: 'LA CLAVE ES INCORRECTO'});
        }

        let datos = {
            codigo: respuesta.codigo,
            nombres: respuesta.nombres,
            dni: respuesta.dni,
            tienda: respuesta.tienda
        }

        let token = jwt.sign({usuario: datos}, process.env.Clave, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.status(200).json({ok: true, token: token});
        
    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR EN LOGIN'});
        next(e);
    }

}

/*=================================
EXPORTANDO EL VALOR {}
===================================*/

module.exports = ctrUsuarioApp;
