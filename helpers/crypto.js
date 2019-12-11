'use strict'
const crypto = require("crypto-js");

const keySize = 256;
const ivSize = 128;
const iterations = 100;

let encrypt = function(msg, pass) {
    let salt = crypto.lib.WordArray.random(128 / 8);

    let key = crypto.PBKDF2(pass, salt, {
        keySize: keySize / 32,
        iterations: iterations
    });

    let iv = crypto.lib.WordArray.random(128 / 8);

    let encrypted = crypto.AES.encrypt(msg, key, {
        iv: iv,
        padding: crypto.pad.Pkcs7,
        mode: crypto.mode.CBC

    });

    // salt, iv will be hex 32 in length
    // append them to the ciphertext for use  in decryption
    let transitmessage = salt.toString() + iv.toString() + encrypted.toString();
    return transitmessage;
}

let decrypt = function(transitmessage, pass) {
    let salt = crypto.enc.Hex.parse(transitmessage.substr(0, 32));
    let iv = crypto.enc.Hex.parse(transitmessage.substr(32, 32))
    let encrypted = transitmessage.substring(64);

    let key = crypto.PBKDF2(pass, salt, {
        keySize: keySize / 32,
        iterations: iterations
    });

    let decrypted = crypto.AES.decrypt(encrypted, key, {
        iv: iv,
        padding: crypto.pad.Pkcs7,
        mode: crypto.mode.CBC

    })
    return decrypted.toString(crypto.enc.Utf8);
}

module.exports = {
    encrypt,
    decrypt
}