'use strict'

const path = require('path');
const config = require(path.join(path.dirname(__dirname), 'config', 'config.js')).config();
const jwt = require('jsonwebtoken');
const pool = require(path.join(path.dirname(__dirname), 'config', 'database.js')).pool;
const mssql = require(path.join(path.dirname(__dirname), 'config', 'database.js')).mssql;

let verifyTokenAPI = (req, res, next) => {
    try {
        let token = req.cookies.token;
        if (!token) {
            res.status(400).send({
                error: "Es Necesario el Token de Autenticación \nHTTP/1.0 400 Bad Request"
            });
        }
        token = token.replace('Bearer ', '');
        jwt.verify(token, config.JWT.API.SECRET, (err, user) => {
            if (err) {
                res.status(401).send({
                    error: 'Token Inválido \nHTTP/1.0 401 Unauthorized'
                });
            }
            next();
        });
    } catch (error) {
        res.status(500).send({
            error: 'Error de Servidor \nHTTP/1.0 500 Internal Server Error'
        });
    }
};

let getTokenAPI = async(req, res, next) => {
    try {
        let user = req.query.usuario;
        let pass = req.query.clave;
        let connect = await pool;
        let result = await connect.request()
            .input('nombre', mssql.VarChar, user)
            .input('id', mssql.Int, pass)
            .query(`SELECT  * FROM tb_vtex_courier AS tvc WHERE  tvc.id = @id AND tvc.nombre = @nombre`);
        if (result.rowsAffected[0] > 0) {
            let tokenData = {
                username: user
            };
            let token = jwt.sign(tokenData, config.JWT.API.SECRET, {
                expiresIn: config.JWT.API.EXPIRES_IN
            });
            req.token = token;
            next();
        } else {
            res.status(400).send({
                error: 'Usuario o Contraseña Inválidos \nHTTP/1.0 400 Bad Request'
            });
        }
    } catch (error) {
        res.status(500).send({
            error: 'Error de Servidor \nHTTP/1.0 500 Internal Server Error'
        });
    }
}


module.exports = {
    verifyTokenAPI,
    getTokenAPI
}