'use strict'

const path = require('path');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ctrUsuarioApp = {};

const mdlUsuarioApp = require(path.join(process.cwd(), 'models', 'xamari', 'usuario_app'));
const mdlTienda = require(path.join(process.cwd(), 'models', 'xamari', 'tiendas'));

const config = require(path.join(process.cwd(), 'config', 'config.js')).config();

let xamarinSecret = config.JWT.XAMARIN.SECRET,
    xamarinExpire = config.JWT.XAMARIN.EXPIRES_IN;

/*==============================
METODO POST | /registrar-admin
================================*/

ctrUsuarioApp.crearUsuarioAdminApp = async (req, res, next) => {

    try {

        if (!/^([0-9])*$/.test(req.body.dni)){
            return res.status(404).json({ok: false, mensaje: "LO SENTIMOS DNI NO CONTIENE LETRAS"});
        }

        const respuesta1 = await mdlTienda.findOne({tienda:req.body.tienda});
        if (respuesta1 == null) {
            return res.status(404).json({ok: false, mensaje: "LO SENTIMOS TIENDA INGRESADO NO IDENTIFICADO"});    
        }

        req.body.clave = await bcryptjs.hash(req.body.clave, 10);
        await mdlUsuarioApp.create(req.body);

        res.status(200).json({ok: true, mensaje: "USUARIO SUPER-ADMIN CREADO CORRECTAMENTE"});
        
    } catch (e) {
        if (e.code == 11000) {
            res.status(500).json({ok: false, mensaje: `LO SENTIMOS EL DATOS ${JSON.stringify(e.keyValue)} YA EXITE`});
        }else{
            res.status(500).json({ok: false, mensaje: 'ERROR AL CREAR USUARIO APP'});
        }
        next(e);
    }


}

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
        await mdlUsuarioApp.create(req.body);

        res.status(200).json({ok: true, mensaje: "USUARIO CREADO CORRECTAMENTE"});
        
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

        const respuesta = await mdlUsuarioApp.findOne({codigo:req.body.codigo})

        if (respuesta == null) {
            return res.status(200).json({ok: false, mensaje:"LO SENTIMOS! USUARIO NO ENCONTRADO"});
        }
        
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
            perfil: respuesta.perfil,
            codigo: respuesta.codigo,
            nombres: respuesta.nombres,
            dni: respuesta.dni,
            tienda: respuesta.tienda
        }

        let token = jwt.sign({usuario: datos}, xamarinSecret, { expiresIn: xamarinExpire });

        res.status(200).json({ok: true, token: token});
        
    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR EN LOGIN'});
        next(e);
    }

}

/*=================================
METODO GET | /lista-usuario
===================================*/

ctrUsuarioApp.listaUserApp = async (req, res, next) => {

    try {
        
        const respuesta = await mdlUsuarioApp.find({perfil:"USER_PERFIL"}, {codigo:1, nombres:1, dni:1, tienda:1, estado:1, perfil:1});
        if (respuesta.length <= 0) {
            return res.status(404).json({ok: false, mensaje: 'ERROR USUARIO NO ENCONTRADO'})
        }
        res.status(200).json({ok: true, data: respuesta});

    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR TO LIST USER'});
        next(e);
    }

}

/*=================================
METODO GET | /lista-all-usuario
===================================*/

ctrUsuarioApp.listaAllUserApp = async (req, res, next) => {

    try {
        
        const respuesta = await mdlUsuarioApp.find({}, {codigo:1, nombres:1, dni:1, tienda:1, estado:1, perfil:1});
        if (respuesta.length <= 0) {
            return res.status(404).json({ok: false, mensaje: 'LO SENTIMOS ALL USUARIO NO ENCONTRADO'})
        }
        res.status(200).json({ok: true, data: respuesta});

    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR TO LIST USER'});
        next(e);
    }

}

/*===============================
METODO POST | /lista-cod-usuario
=================================*/

ctrUsuarioApp.listaCodUser = async (req, res, next) => {

    try {
        
        const respuesta = await mdlUsuarioApp.findById({_id:req.body.id}, {codigo:1, nombres:1, dni:1, tienda:1, estado:1, perfil:1});
        if (!respuesta) {
            res.status(404).json({ok: false, mensaje: 'ERROR USUARIO NO ENCONTRADO'});
        }
        res.status(200).json({ok: true, data: respuesta});

    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR TO LIST USER'});
        next(e);
    }

}

/*===============================
METODO PUT | /update-usuario
=================================*/

ctrUsuarioApp.updateCodUser = async (req, res, next) => {

    try {

        req.body.clave = await bcryptjs.hash(req.body.clave, 10);

        const respuesta = await mdlUsuarioApp.findByIdAndUpdate({_id:req.body._id},
        {codigo: req.body.codigo, clave: req.body.clave, nombres: req.body.nombres, dni: req.body.dni, tienda: req.body.tienda,
            estado: req.body.estado, perfil: req.body.perfil});
        
        if (!respuesta) {
            res.status(404).json({ok: false, mensaje: 'ERROR USUARIO NO ENCONTRADO'});
        }
        res.status(200).json({ok: true, mensaje: 'USUARIO ACTUALIZADO CORRECTAMENTE'});

    } catch (e) {
        if (e.code == 11000) {
            res.status(500).json({ok: false, mensaje: `LO SENTIMOS EL DATOS ${JSON.stringify(e.keyValue)} YA EXITE`});
        }else{
            res.status(500).json({ok: false, mensaje: 'ERROR TO LIST USER'});
        }
        next(e);
    }

}

/*===============================
METODO DELETE | /delete-usuario
=================================*/

ctrUsuarioApp.deleteCodUser = async (req, res, next) => {

    try {

        await mdlUsuarioApp.findByIdAndDelete({_id:req.body._id});
        res.status(200).json({ok: true, mensaje: 'USUARIO ELIMINADO CORRECTAMENTE'});

    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR AL ELIMINAR USUARIO'});
        next(e);
    }

}


module.exports = ctrUsuarioApp;
