'use strict'

const path = require('path');
const config = require(path.join(process.cwd(), 'config', 'config.js')).config();
const jwt = require('jsonwebtoken');
const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));

let verifyTokenAPI = (req, res, next) => {
    try {
        let token = req.headers['authorization']
        if (!token) {
            res.status(400).send({
                error: 'HTTP/1.0 400 Bad Request\n Es Necesario el Token de Autenticación'
            });
        }
        token = token.replace('Bearer ', '');
        jwt.verify(token, config.JWT.API.SECRET, (err, user) => {
            if (err) {
                res.status(401).send({
                    error: 'HTTP/1.0 401 Unauthorized\n Token Inválido'
                });
            } else {
                next();
            }
        });
    } catch (e) {
        console.log('Get Tokens (getTokenApi)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error Error de Servidor',
            msg: new String(e)
        });
    }
};

let getTokenAPI = async (req, res, next) => {
    try {
        let user = req.query.usuario;
        let pass = req.query.clave;
        let connect = await pool;
        let result = await connect.request()
            .input('usuario', mssql.VarChar, user)
            .input('clave', mssql.VarChar, pass)
            .query(`SELECT p.NOMBRE,p.CODIGO FROM bd_passarela.dbo.PERSONA AS p WITH(NOLOCK)  WHERE p.USUARIO = @usuario AND p.CLAVE = @clave`);
        if (result.rowsAffected[0] > 0) {
            let tokenData = {
                username: user
            };
            let token = jwt.sign(tokenData, config.JWT.API.SECRET, {
                expiresIn: config.JWT.API.EXPIRES_IN
            });
            if (token) {
                res.status(200).send({
                    token: token
                })
            } else {
                res.status(400).send({
                    error: 'HTTP/1.0 400 Bad Request\n Error al generar token, intente nuevamente'
                })
            }
            next();
        } else {
            res.status(400).send({
                error: 'HTTP/1.0 400 Bad Request\n Usuario o Contraseña Inválidos'
            });
        }
    } catch (e) {
        ('Verify Token (verifyTokenApi)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server Error\n Error de Servidor',
            msg: new String(e)
        });
    }
}

let getTokenFlutter = async (req, res, next) => {
    try {
        let data = req.body;
        let connect = await pool;
        let result = await connect.request()
            .input('usuario', mssql.VarChar, data.usuario)
            .input('clave', mssql.VarChar, data.clave)
            .input('idDevice', mssql.VarChar, data.idevice)
            .execute(`wms_passarela.dbo.sp_ic_app_login`);
        if (result.rowsAffected[0] > 0) {
            let tokenData = {
                username: data.usuario
            };
            let token = jwt.sign(tokenData, config.JWT.FLUTTER.SECRET, {
                expiresIn: config.JWT.FLUTTER.EXPIRES_IN
            });
            if (token) {
                res.status(200).send({
                    token: token,
                    data: result.recordset[0]
                })
            } else {
                res.status(400).send({
                    error: 'HTTP/1.0 400 Bad Request\n Error al generar token, intente nuevamente'
                })
            }
            next();
        } else {
            res.status(400).send({
                error: 'HTTP/1.0 400 Bad Request\n Usuario o Contraseña Inválidos'
            });
        }
    } catch (e) {
        console.log('Get Tokens (getTokenFlutter)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server Error\n Error de Servidor',
            msg: new String(e)
        });
    }
}

let verifyTokenFlutter = (req, res, next) => {
    try {
        let token = req.headers['authorization']
        if (!token) {
            res.status(400).send({
                error: 'HTTP/1.0 400 Bad Request\n Es Necesario el Token de Autenticación'
            });
        }
        jwt.verify(token, config.JWT.FLUTTER.SECRET, (err, user) => {
            if (err) {
                res.status(401).send({
                    error: 'HTTP/1.0 401 Unauthorized\n Token Inválido'
                });
            } else {
                next();
            }
        });
    } catch (e) {
        console.log('Verify Token (verifyTokenFlutter)', e)
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error Error de Servidor',
            msg: new String(e)
        });
    }
};

module.exports = {
    verifyTokenAPI,
    getTokenAPI,
    getTokenFlutter,
    verifyTokenFlutter
}