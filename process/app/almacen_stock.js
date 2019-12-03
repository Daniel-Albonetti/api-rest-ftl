'use strict'
const fetch = require('node-fetch');

let stockMovimientos = () => {
    fetch(`https://api.footloose.pe:999/mobile/app_stock/stock_diario_mov/lista-stock-diario-mov`)
    .then(res => res.json())
    .then(stockDiarioMovMongo => {

        if (stockDiarioMovMongo.ok != false) {

            let datos = stockDiarioMovMongo.data;

            let idUltimoMov = 0;
            for (let y = 0; y < datos.length; y++) {
                idUltimoMov = datos[y].id;
            }

            fetch(`https://api.footloose.pe:999/mobile/app_stock/stock_diario_mov_sql/stock-diario-mov/${idUltimoMov}`)
            .then(res => res.json())
            .then(stockMov => {

                if (stockMov.ok != false) {
                    
                    let datos = stockMov.data;

                    for (let i = 0; i < datos.length; i++) {
                        
                        let stockDiarioMov = {
                            id: datos[i].id,
                            Tda: datos[i].Tda,
                            Codigointerno: datos[i].Codigointerno,
                            stock: datos[i].stock,
                            precioetiqueta: datos[i].precioetiqueta,
                            precioventa: datos[i].precioventa
                        }

                        fetch(`https://api.footloose.pe:999/mobile/app_stock/stock_diario_mov/registrar`,{
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(stockDiarioMov)
                        })
                        .then(res => res.json())
                        .then(stockDiarioMov => {

                            console.log('stockDiarioMov', stockDiarioMov);

                        })
                        
                    }

                }else{
                    console.log("stockMov: ", stockMov);
                }

            })
        
        }else{
            console.log("stockDiarioMovMongo: ", stockDiarioMovMongo);
        }

    })

}


module.exports = {
    stockMovimientos
}