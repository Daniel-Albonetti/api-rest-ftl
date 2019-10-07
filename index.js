'use strict'

const path = require('path');
const config = require(path.join(__dirname, 'config', 'config.js')).config();
const http = require('http');
const express = require("express");
const app = express();
const routes = require(path.join(__dirname, 'routes', 'routes.js'));
const sip = require(path.join(__dirname, 'routes', 'sip.js'));

app.set('port', config.PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));



app.use('/', routes);
app.use('/sip', sip);

http.createServer(app).listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'))
})