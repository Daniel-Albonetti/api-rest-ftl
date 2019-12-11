'use strict'

const path = require('path');

const { pool } = require(path.join(process.cwd(), 'config', 'database.js'));
require(path.join(process.cwd(), 'config', 'mongodb.js'));

const mdlStockDiarioMov = require(path.join(process.cwd(), 'models', 'xamari', 'stock_diario_mov'));

let stockMovimientos = async () => {

    const respuesta = await mdlStockDiarioMov.findOne({}, {id:1}).sort({$natural:-1}).limit(1);
    let valor = 0;
    if (respuesta != null) {
        valor = respuesta.id;
    }

    const connect = await pool;
    const data = await connect.request()
    .query(`SELECT * FROM [dbo].[tmp_alm_stock_diario_mov] WHERE id > ${valor}`);
    if(data.recordset.length <= 0){
        return //console.log('ERROR! NO SE ENCONTRARON DATOS');
    }

    const datos =  data.recordset

    for (let i = 0; i < datos.length; i++) {
                        
        let stockDiarioMov = {
            id: datos[i].id,
            Tda: datos[i].Tda,
            Codigointerno: datos[i].Codigointerno,
            stock: datos[i].stock,
            precioetiqueta: datos[i].precioetiqueta,
            precioventa: datos[i].precioventa
        }

        await mdlStockDiarioMov.create(stockDiarioMov);
        
    }

}

module.exports = {
    stockMovimientos
}