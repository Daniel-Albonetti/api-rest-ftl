'use strict'

const path = require('path');
const express = require('express');
const router = express.Router();
const util = require('util');
const request = require('request');
const config = require(path.join(process.cwd(), 'config', 'config.js')).config();

let credentials = {
    clientId: config.CREDENTIALS.MERCADOLIBRE.CLIENTID,
    clientSecret: config.CREDENTIALS.MERCADOLIBRE.CLIENTSECRET
}

const tokenMercadoLibreController = require(path.join(process.cwd(), 'controllers', 'mercado_libre', 'token'));

router.get('/tokenML', tokenMercadoLibreController.token);
router.get('/adquirerToken', tokenMercadoLibreController.adquirerToken);


router.get('/footloose', function(req, res) {
    var redirectUrl = util.format('https://auth.mercadolibre.com.pe/authorization?response_type=code&client_id=',
        credentials.clientId);
    res.redirect(redirectUrl);



});

router.get('/footloose/callback', function(req, res) {
    var code = req.query.code;
    var authcallback = 'https://api.footloose.pe:999/mercadolibre/auth/footloose/callback';
    var accessTokenUrl = util.format('https://api.mercadolibre.com/oauth/token?grant_type=authorization_code&client_id=%s&client_secret=%s&code=%s&redirect_uri=%s',
        credentials.clientId, credentials.clientSecret, code, authcallback);
    request.post(accessTokenUrl, function(error, response, body) {
        res.send(body);
    });
});

router.get('/', (req, res) => {
    res.status(200).json({
        msg: '¡Api Mercado Libre!'
    });
});

module.exports = router;