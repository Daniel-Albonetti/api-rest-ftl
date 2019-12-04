'use strict'
const path = require('path');
const config = require(path.join(process.cwd(), 'config', 'config.js')).config();
const fetch = require('node-fetch');

const appKey = config.CREDENTIALS.VTEX.APPKEY;
const appToken = config.CREDENTIALS.VTEX.APPTOKEN;

const {
    checkStatus,checkStatus2
} = require(path.join(process.cwd(), 'middleware', 'check_fetch.js'));

// Cupones
let createCoupon = (data) => {
    let options = {
        method: 'POST',
        timeout: 2500,
        headers: {
            'cache-control': 'no-cache',
            Host: 'passarelape.vtexcommercestable.com.br',
            Accept: '*/*',
            'Content-Type': 'application/json',
            'X-VTEX-API-AppToken': appToken,
            'X-VTEX-API-AppKey': appKey
        },
        body: JSON.stringify(data)
    };

    return fetch('https://passarelape.vtexcommercestable.com.br/api/rnb/pvt/coupon/', options)
        .then(checkStatus)
        .then((rsp) => {
            return rsp;
        })
        .catch((err) => {
            throw err
        });
}

/**
 * @param String couponId 
 */
let archiveCoupon = (couponId) => {
    let options = {
        method: 'POST',
        timeout: 2500,
        headers: {
            'cache-control': 'no-cache',
            Host: 'passarelape.vtexcommercestable.com.br',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'Content-Type': 'application/json',
            'X-VTEX-API-AppToken': appToken,
            'X-VTEX-API-AppKey': appKey
        }
    }
    return fetch(`https://passarelape.vtexcommercestable.com.br/api/rnb/pvt/archive/coupon/${couponId}`, options)
        .then(checkStatus)
        .then((rsp) => {
            return rsp;
        })
        .catch((err) => {
            throw err
        });
}

// Stock

/**
 * 
 * @param Integer skuId 
 */
let getStock = (skuId) => {
    let options = {
        method: 'GET',
        timeout: 2500,
        headers: {
            'cache-control': 'no-cache',
            Host: 'passarelape.vtexcommercestable.com.br',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'X-VTEX-API-AppToken': appToken,
            'X-VTEX-API-AppKey': appKey,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        }
    };
    return fetch(`https://logistics.vtexcommercestable.com.br/api/logistics/pvt/inventory/skus/${skuId}?an=passarelape`, options)
        .then(checkStatus)
        .then((data) => {
            return data;
        })
        .catch((err) => {
            throw err;
        });
}

/**
 * 
 * @param {*} data 
 *  skuId: Integer
 *  stock: Integer
 *  warehouse: String
 */
let setStock = (data) => {
    let options = {
        method: 'PUT',
        timeout: 2500,
        headers: {
            'cache-control': 'no-cache',
            Host: 'passarelape.vtexcommercestable.com.br',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'X-VTEX-API-AppToken': appToken,
            'X-VTEX-API-AppKey': appKey,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            "quantity": data.stock
        })
    };
    return fetch(`https://logistics.vtexcommercestable.com.br/api/logistics/pvt/inventory/skus/${data.skuId}/warehouses/${data.warehouse}?an=passarelape`, options)
        .then(checkStatus)
        .then((data) => {
            return data;
        })
        .catch((err) => {
            throw err;
        });
}

// Libro de Reclamos
/**
 * @param {*} data 
 *  name: String
 *  lastname: String
 *  documentType: String
 *  nrodoc: String
 *  address: String
 *  celphone: String
 *  client: String
 *  date: Date
 *  details: String
 *  numberorder: String
 *  totalsale: Integer
 *  reclamoqueja: String
 *  description: String
 *  descriptionProduct: String
 */
let createClaimBook = (data) => {
    let options = {
        method: 'PUT',
        headers: {
            'cache-control': 'no-cache',
            Host: 'api.vtexcrm.com.br',
            'Content-Type': 'application/json',
            "Accept": "application/vnd.vtex.ds.v10+json"
        },
        body: JSON.stringify(data)
    };
    return fetch('http://api.vtexcrm.com.br/passarelape/dataentities/LR/documents', options)
        .then(checkStatus)
        .then((rsp) => {
            return rsp;
        })
        .catch((err) => {
            throw err
        });
}

//Estados
let getStatusFeed = () => {
    let options = {
        method: 'GET',
        timeout: 3000,
        headers: {
            'cache-control': 'no-cache',
            Host: 'passarelape.myvtex.com',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'X-VTEX-API-AppToken': appToken,
            'X-VTEX-API-AppKey': appKey,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        }
    };
    return fetch(`https://passarelape.myvtex.com/api/orders/feed?maxlot=10`, options)
        .then(checkStatus)
        .then((data) => {
            return data;
        })
        .catch((err) => {
            throw err;
        });
}

let commitStatusFeed = (handle) => {
    let options = {
        method: 'POST',
        timeout: 3000,
        headers: {
            'cache-control': 'no-cache',
            Host: 'passarelape.myvtex.com',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'X-VTEX-API-AppToken': appToken,
            'X-VTEX-API-AppKey': appKey,
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            "handles": [
                handle
            ]
        })
    };
    return fetch(`https://passarelape.myvtex.com/api/orders/feed`, options)
        .then(checkStatus2)
        .then((data) => {
            return true;
        })
        .catch((err) => {
            console.log('Helpers/vtex.js (commitStatusFeed)', err)
            return false;
        });
}



module.exports = {
    createCoupon,
    archiveCoupon,
    getStock,
    setStock,
    createClaimBook,
    getStatusFeed,
    commitStatusFeed
}