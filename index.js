'use strict'

const path = require('path');
const config = require(path.join(__dirname, 'config', 'config.js')).config();
const http = require('http');
const express = require("express");
const app = express();

app.set('port', config.PORT);

http.createServer(app).listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'))
})