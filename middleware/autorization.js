'use strict'

const path = require('path');
const config = require(path.join(path.dirname(__dirname), 'config', 'config.js')).config();
const jwt = require('jsonwebtoken');
const pool = require(path.join(path.dirname(__dirname), 'config', 'database.js')).pool;
const mssql = require(path.join(path.dirname(__dirname), 'config', 'database.js')).mssql;

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
    } catch (error) {
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server\n Error Error de Servidor'
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
                error: 'HTTP/1.0 400 Bad Request\n Usuario o Contraseña Inválidos'
            });
        }
    } catch (error) {
        res.status(500).send({
            error: 'HTTP/1.0 500 Internal Server Error\n Error de Servidor'
        });
    }
}


module.exports = {
    verifyTokenAPI,
    getTokenAPI
}