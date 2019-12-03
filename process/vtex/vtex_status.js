'use strict'
const path = require('path');
const moment = require('moment');
const util = require('util');
const sleep = util.promisify(setTimeout);

const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));

const {
    getStatusFeed,
    commitStatusFeed
} = require(path.join(process.cwd(), 'helpers', 'vtex.js'));


async function attemptsCommitStatus(info) {
    let i = 1;
    do {
        let time = Math.random() * 5000;
        await sleep(time);
        let commit = await commitStatusFeed(info.handle);
        console.log(`commit ${i} - ${info.orderId}`, commit);
        if (commit) {
            i = 4;
        } else {
            i++;
        }
    } while (i < 3);
}

async function insertStatus(status) {
    try {
        let time = Math.random() * 7000;
        await sleep(time);
        const connect = await pool;
        const result = await connect.request()
            .input('_origen', mssql.VarChar, status.domain)
            .input('_numero_orden', mssql.VarChar, status.orderId)
            .input('_estado_orden', mssql.VarChar, status.state)
            .input('_fecha_estado', mssql.DateTime, new Date(moment(status.currentChange).format('YYYY-MM-DD HH:mm:ss.SSS')))
            .execute("Ecommerce.dbo.sp_md_insUpdFeedStatus_Vtex");
        let res = result.recordset[0].resultado;
        if (res == 'SUCCESS') {
            attemptsCommitStatus({
                orderId: status.orderId,
                handle: status.handle
            });
        } else {
            console.log(`process/vtex/vtex_status.js (insertStatus) ${status.orderId}`, result.recordset[0].mensaje1)
        }
    } catch (e) {
        console.log(`vtex_status.js (insertStatus) ${status.orderId}`, e);
    }

}

let statusFeed = ()=>{ getStatusFeed()
    .then(data => {
        let dataSize = data.length;
        if (dataSize > 0) {
            data.forEach(element => {
                insertStatus(element);
            });
        }
    })
    .catch(error => {
        console.log('vtex_status.js (getStatusFeed)', error)
    });
}

module.exports = {
    statusFeed
}