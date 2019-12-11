'use strict'
const path = require('path');
const util = require('util');
const sleep = util.promisify(setTimeout);
const schedule = require('node-schedule');

const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));

const {
    getStock,
    setStock
} = require(path.join(process.cwd(), 'helpers', 'vtex.js'));

async function jobStockBd() {
    try {
        const connect = await pool;
        const result = await connect.request()
            .execute(`Ecommerce.dbo.sp_md_UpdStock`);
        if (result.recordset[0] == 'SUCCESS') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new Error(error)
    }
}

async function getStockBd(tipo) {
    try {
        let market = 0,
            refid = '';
        switch (tipo) {
            case 1: //Vtex
                market = 2;
                refid = 'CP';
                break;
            default: //CierraPuertas
                market = 4;
                refid = 'PS';
                break;
        }
        const connect = await pool;
        const result = await connect.request()
            .input('_market', mssql.Int, market)
            .input('_refid', mssql.VarChar, refid)
            .query(`SELECT CAST(s.id_ref AS INT)              AS id,
                tsm.stock_actual                   AS stock
                FROM   ecommerce.tb_sku_marketplace       AS tsm WITH(NOLOCK)
                RIGHT JOIN vtex_passarela.dbo.sku  AS s WITH(NOLOCK)
                ON  tsm.sku = s.ean
                AND tsm.market_place = @_market
                WHERE  LEFT(s.refid, 2) <> 'PK'
                AND LEFT(s.refid, 2) <> @_refid
                AND tsm.id IS NOT NULL
                AND tsm.stock_anterior <> tsm.stock_actual
                ORDER BY
                CAST(s.id_ref AS INT)
                `);
        return result.recordset;
    } catch (error) {
        throw new Error(error)
    }
}

async function attemptsSetStock(info) {
    let i = 1;
    do {
        let time = Math.ceil(Math.random() * 5000);
        await sleep(time);
        let commit = await setStock(info);
        console.log(`Set Stock ${i} - ${info.id}`, commit);
        if (commit) {
            i = 4;
        } else {
            i++;
        }
    } while (i < 3);
}

async function stock(product) {
    try {
        let time = Math.ceil(Math.random() * 10000);
        await sleep(time);
        let stockVtex = await getStock(product.id);
        let warehousesId = stockVtex.balance[0].warehouseId;
        let reserveStock = stockVtex.balance[0].reservedQuantity;
        let nowStock = product.stock - reserveStock;
        nowStock = (nowStock <= 0) ? 0 : nowStock;
        attemptsSetStock({
            id: prod.id,
            wh: warehousesId,
            stk: nowStock
        })
    } catch (error) {
        console.log('Set Stock Error (stock)', error)
    }


}

async function upStock(tipo) {
    try {
        let stockBd = await getStockBd(tipo);
        let stockBdSize = stockBd.length;
        let steps = 0;
        for (let i = 0; i < stockBdSize; i++) {
            steps++;
            if (steps == 200) {
                await sleep(40000);
                steps = 0;
            }
            stock(stockBd[i])
        }
    } catch (error) {
        console.log('Set Stock Error (upStock)', error)
    }
}

async function startStockVtex() {
    try {
        let jobStock = await jobStockBd();
        if (jobStock) {
            await upStock(2);
            await sleep(200000);
            await upStock(1);
        } else {
            console.log('Set Stock False (startStockVtex)')
        }
    } catch (error) {
        console.log('Set Stock Error (startStockVtex)', error)
    }
}

let stockVtexMorning = schedule.scheduleJob('0 30 9 * * *', () => {
    startStockVtex();
});

let stockVtexAfternoon = schedule.scheduleJob('0 30 14 * * *', () => {
    startStockVtex();
});

let stockVtexNight = schedule.scheduleJob('0 30 21 * * *', () => {
    startStockVtex();
});

module.exports = {
    stockVtexMorning,
    stockVtexAfternoon,
    stockVtexNight
}