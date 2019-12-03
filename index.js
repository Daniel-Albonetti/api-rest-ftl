'use strict'
const path = require('path');
const express = require("express");
const app = express();
const fs = require('fs');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const config = require(path.join(__dirname, 'config', 'config.js')).config();
const routes = require(path.join(__dirname, 'routes', 'routes.js'));

require(path.join(__dirname, 'config', 'mongodb.js'));

/**
 * Configuraciones
 */
app.set('port', config.PORT);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Origins
app.use((req, res, next) => {
    // console.log(origin);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

/**
 * Rutas
 */
app.use('/', routes);

/**
 * Servidor
 */
let environment = config.HOST.toLowerCase();

if (environment.indexOf('localhost') > -1) {
    /**
     * Desarrollo - Local - HTTP
     */
    //Run HTTP
    http.createServer(app).listen(app.get('port'), () => {
        console.log('Express server listening on port ' + app.get('port'));
    });
    // saludo();
} else {
    /**
     * Producción - HTTPS
     */
    // Certificate https://api.footloose.pe:999/
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.footloose.pe/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/api.footloose.pe/fullchain.pem', 'utf8');

    const credentials = {
        key: privateKey,
        cert: certificate,
    };

    //Run HTTPS
    https.createServer(credentials, app).listen(app.get('port'), () => {
        console.log('Express server listening on port ' + app.get('port'));
    });
}