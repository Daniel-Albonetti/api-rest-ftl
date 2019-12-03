'use strict'
const path = require('path');
const fetch = require('node-fetch');
const moment = require('moment');
const util = require('util');

const sleep = util.promisify(setTimeout);
const {
    mssql,
    pool
} = require(path.join(process.cwd(), 'config', 'database.js'));

const apiKey = 'vtexappkey-passarelape-PCMPGX';
const apiToken = 'PBYDXOLYIULIRNFLPOEMJVNULWXTZZDFZGUPGVGWNTYBHWMOLHASQEKTNESBQRZJRFJLSPFTIIZPXMMOJJIRYKPUVACCDEFWTOKCNAVWCHKIEUWBRERGIIKGPOPRNCPD';

async function checkStatus(res) {
    if (res.ok) {
        return res.json();
    } else {
        let msgError = await res.json();
        throw JSON.stringify({
            body: msgError
        })
    }
}

function getVtexOrderList() {
    let options = {
        method: 'GET',
        timeout: 4000,
        headers: {
            'cache-control': 'no-cache',
            'X-VTEX-API-AppKey': apiKey,
            'X-VTEX-API-AppToken': apiToken,
            'Content-Type': 'application/json',
            'Accept-Charset': 'utf-8',
            Accept: 'application/json'
        }
    };
    return fetch(`https://passarelape.vtexcommercestable.com.br/api/oms/pvt/orders?f_status=ready-for-handling&per_page=100&page=1`, options)
        .then(checkStatus)
        .then((data) => {
            return data;
        })
        .catch((error) => {
            throw err
        });
}

function getVtexOrder(id) {
    let options = {
        method: 'GET',
        timeout: 4000,
        headers: {
            'cache-control': 'no-cache',
            'X-VTEX-API-AppKey': apiKey,
            'X-VTEX-API-AppToken': apiToken,
            'Content-Type': 'application/json',
            'Accept-Charset': 'utf-8',
            Accept: 'application/json'
        }
    };
    return fetch(`https://passarelape.vtexcommercestable.com.br/api/oms/pvt/orders/${id}`, options)
        .then(checkStatus)
        .then((data) => {
            return data;
        })
        .catch((error) => {
            throw err
        });
}

function getVtexCustomerEmail(id) {
    let options = {
        method: 'GET',
        timeout: 4000,
        headers: {
            'cache-control': 'no-cache',
            'X-VTEX-API-AppKey': apiKey,
            'X-VTEX-API-AppToken': apiToken,
            'Content-Type': 'application/json',
            'Accept-Charset': 'utf-8',
            Accept: 'application/json'
        }
    };
    return fetch(`https://passarelape.vtexcommercestable.com.br/api/oms/pvt/orders/${id}/conversation-message`, options)
        .then(checkStatus)
        .then((data) => {
            let dataSize = data.length;
            let customerEmail = '';
            search_email:
                for (let i = 0; i < dataSize; i++) {
                    let toSize = data[i].to.length;
                    for (let j = 0; j < toSize; j++) {
                        let emailRole = data[i].to[j].role;
                        if (emailRole == 'Customer') {
                            customerEmail = data[i].to[j].email;
                            break search_email;
                        }
                    }
                }
            return customerEmail;
        })
        .catch((error) => {
            throw err
        });
}

let getOrders = async() => {
    try {
        let orderList = await getVtexOrderList();
        console.log('orderList', orderList)
    } catch (error) {
        console.log('error get orders', error)
    }
}

// getOrders()

getVtexOrder('913411982568-01')