'use strict'

const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, 'config', '.env')
});

const config = () => {
    let envJSON = require(path.join(__dirname, 'config.json'));
    let node_env = process.env.NODE_ENV || 'local';
    return envJSON[node_env];
}

exports.config = config;