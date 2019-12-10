'use strict'
const path = require('path');
const config = require(path.join(process.cwd(), 'config', 'config.js')).config();
const fetch = require('node-fetch');
const {
    checkStatus
} = require(path.join(process.cwd(), 'middleware', 'check_fetch.js'));

const appKey = config.CREDENTIALS.WOOWUP.APPKEY;

//Usuario

/**
 * 
 * @param {*} data 
 *  
 */

let existUser = (email) => {
    let options = {
        method: 'GET',
        timeout: 2500,
        headers: {
            "Authorization": appKey,
            'cache-control': 'no-cache',
            Host: 'api.woowup.com',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        }
    };
    return fetch(`https://api.woowup.com/apiv3/multiusers/find?email=${email}`, options)
        .then(checkStatus)
        .then((rsp) => {
            return true;
        })
        .catch((err) => {
            throw false;
        });
}

/**
 * 
 * @param {*} data 
 * 
 */
let updateUser = (data) => {
    let options = {
        method: 'PUT',
        timeout: 3000,
        headers: {
            "Authorization": appKey,
            'cache-control': 'no-cache',
            Host: 'api.woowup.com',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data)
    };
    return fetch(`https://api.woowup.com/apiv3/multiusers`, options)
        .then(checkStatus)
        .then((rsp) => {
            return rsp;
        })
        .catch((err) => {
            throw err;
        });
}

/**
 * 
 * @param {*} data 
 * 
 */
let createUser = (data) => {
    let options = {
        method: 'POST',
        timeout: 3000,
        headers: {
            "Authorization": appKey,
            'cache-control': 'no-cache',
            Host: 'api.woowup.com',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data)
    };
    return fetch(`https://api.woowup.com/apiv3/users`, options)
        .then(checkStatus)
        .then((rsp) => {
            return rsp;
        })
        .catch((err) => {
            throw err;
        });
}

module.exports={
    existUser,
    createUser,
    updateUser
}