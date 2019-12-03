/*==================================
REQUIRIENDO JWT
====================================*/

const jwt = require('jsonwebtoken');

/*==================================
VERIFICAR TOKEN
====================================*/

const verificarToken = async (req, res, next) => {

    try {
    
        let token = req.get('token');
        let decoded = await jwt.verify(token, process.env.Clave);
        req.usuario = decoded.usuario;
        next();

    } catch (e) {

        if (e.message == 'jwt expired') {
            res.status(500).json({ok: false, mensaje: e.name});
        }else{
            res.status(500).json({ok: false, mensaje: 'ERROR EN PROCESO DE TOKEN'});
        }
        next(e);
    }

}

/*===================================
EXPORT VERIFICAR TOKEN
=====================================*/

module.exports = {

    verificarToken

}