'use strict'
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');

const {
    checkStatus
} = require(path.join(process.cwd(), 'middleware', 'check_fetch.js'));


let moveFile = (url) => {
    let formData = new FormData();
    formData.append('file', fs.createReadStream(url));

    let options = {
        method: 'POST',
        headers: {
            'cache-control': 'no-cache',
            Host: '192.168.1.172:8090',
            'Content-Type': 'application/json',
            "Accept": "*/*"
        },
        body: formData
    };
    return fetch('http://192.168.1.172:8090/scriptcase/app/Passarela/apis_almacen_nodejs_post_blank/apis_almacen_nodejs_post_blank.php', options)
        .then(checkStatus)
        .then((rsp) => {
            return rsp;
        })
        .catch((err) => {
            throw err
        });
}

module.exports = {
    moveFile
}