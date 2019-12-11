'use strict'
const path = require('path');
const xl = require('excel4node');
const schedule = require('node-schedule');
const moment = require('moment');

const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));

const url = path.join(process.cwd(), 'process', 'files', 'reportes', 'shopstar');

function addRowSheet1(wb, ws, index, data, type) {
    let _row = index + 2;
    const style = wb.createStyle({
        font: {
            color: '#000000',
            size: 12,
        }
    });
    if (type == 0) {
        ws.cell(_row, 1).number(data.id).style(style);
        ws.cell(_row, 2).string(data.codigo_order).style(style);
        ws.cell(_row, 3).date(data.fecha_order).style(style).style({
            numberFormat: 'dd-mm-yyyy hh:mm:ss'
        });
        ws.cell(_row, 4).string(data.metodo_pago).style(style);
        ws.cell(_row, 5).string(data.sitio_web).style(style);
        ws.cell(_row, 6).string(data.sku).style(style);
        ws.cell(_row, 7).string(data.nombre_sku).style(style);
        ws.cell(_row, 8).string(data.marca).style(style);
        ws.cell(_row, 9).number(data.comision).style(style).style({
            numberFormat: '#0.00%; -#0.00%; 0.00'
        });
        ws.cell(_row, 10).number(data.cantidad).style(style);
        ws.cell(_row, 11).number(data.monto_subtotal).style(style).style({
            numberFormat: '#0.00; -#0.00; 0.00'
        });
        ws.cell(_row, 12).number(data.monto_descuento).style(style).style({
            numberFormat: '#0.00; -#0.00; 0.00'
        });
        ws.cell(_row, 13).number(data.monto_total).style(style).style({
            numberFormat: '#0.00; -#0.00; 0.00'
        });
        ws.cell(_row, 14).number(data.monto_price).style(style).style({
            numberFormat: '#0.00; -#0.00; 0.00'
        });
        ws.cell(_row, 15).formula(`N${_row}-M${_row}`).style(style).style({
            numberFormat: '#0.00; -#0.00; 0.00'
        });
        ws.cell(_row, 16).formula(`N${_row}*I${_row}`).style(style).style({
            numberFormat: '#0.00; -#0.00; 0.00'
        });
    } else {
        ws.cell(_row, 1).string('Id').style(style);
        ws.cell(_row, 2).string('Código Pedido').style(style);
        ws.cell(_row, 3).string('Fecha Pedido').style(style);
        ws.cell(_row, 4).string('Método Pago').style(style);
        ws.cell(_row, 5).string('Sitio Web').style(style);
        ws.cell(_row, 6).string('Sku').style(style);
        ws.cell(_row, 7).string('Producto').style(style);
        ws.cell(_row, 8).string('Marca').style(style);
        ws.cell(_row, 9).string('Comisión').style(style);
        ws.cell(_row, 10).string('Cantidad').style(style);
        ws.cell(_row, 11).string('Subtotal').style(style);
        ws.cell(_row, 12).string('Descuento').style(style);
        ws.cell(_row, 13).string('Precio Venta ShopStar').style(style);
        ws.cell(_row, 14).string('Precio Venta Footloose').style(style);
        ws.cell(_row, 15).string('Costo Asumido por ShopStar').style(style);
        ws.cell(_row, 16).string('Comisión a Pagar').style(style);
    }

}

function addRowSheet2(wb, ws, index, data, type) {
    let _row = index + 2;
    const style = wb.createStyle({
        font: {
            color: '#000000',
            size: 12,
        }
    });
    if (type == 0) {
        ws.cell(_row, 1).number(data.id).style(style);
        ws.cell(_row, 2).string(data.codigo_order).style(style);
        ws.cell(_row, 3).string(data.sitio_web).style(style);
        ws.cell(_row, 4).string(data.tipo_shipping).style(style);
        ws.cell(_row, 5).string(data.tienda_shipping).style(style);
        ws.cell(_row, 6).string(data.nombre).style(style);
        ws.cell(_row, 7).number(data.numero_piezas).style(style);
        ws.cell(_row, 8).string(data.track_courier).style(style);
        ws.cell(_row, 9).string(data.ubigeo_shipping).style(style);
        ws.cell(_row, 10).string(data.departamento_shipping).style(style);
        ws.cell(_row, 11).string(data.provincia_shipping).style(style);
        ws.cell(_row, 12).string(data.distrito_shipping).style(style);
        ws.cell(_row, 13).number((data.precio_shipping == null) ? 0.00 : data.precio_shipping).style(style).style({
            numberFormat: '#0.00; -#0.00; 0.00'
        });
        ws.cell(_row, 14).number(data.monto_envio).style(style).style({
            numberFormat: '#0.00; -#0.00; 0.00'
        });
        ws.cell(_row, 15).formula(`M${_row}-N${_row}`).style(style).style({
            numberFormat: '#0.00; -#0.00; 0.00'
        });
    } else {
        ws.cell(_row, 1).string('Id').style(style);
        ws.cell(_row, 2).string('Código Pedido').style(style);
        ws.cell(_row, 3).string('Sitio Web').style(style);
        ws.cell(_row, 4).string('Tipo de Envio').style(style);
        ws.cell(_row, 5).string('Tienda').style(style);
        ws.cell(_row, 6).string('Courier').style(style);
        ws.cell(_row, 7).string('Número de Piezas').style(style);
        ws.cell(_row, 8).string('Track').style(style);
        ws.cell(_row, 9).string('Ubigeo').style(style);
        ws.cell(_row, 10).string('Departamento').style(style);
        ws.cell(_row, 11).string('Provincia').style(style);
        ws.cell(_row, 12).string('Distrito').style(style);
        ws.cell(_row, 13).string('Precio de Envio 1').style(style);
        ws.cell(_row, 14).string('Precio de Envio 2 (Asumido por el Cliente)').style(style);
        ws.cell(_row, 15).string('Precio de Envio 3 (Asumido por ShopStar)').style(style);
    }

}

function addTotalSheet1(ws, index, col, formula, comment, type) {
    let _row = index;
    switch (type) {
        case 0:
            ws.cell(_row, col).formula(formula).comment(comment).style({
                numberFormat: '#0.00; -#0.00; 0.00'
            });
            break;
        case 1:
            ws.cell(_row, col).string(comment);
            break;
        case 2:
            ws.cell(_row, col).number(formula).comment(comment).style({
                numberFormat: '#0.00; -#0.00; 0.00'
            });
            break;
        default:
            break;
    }
}

function addSheet2(wb, ws, array) {
    addRowSheet2(wb, ws, -1, '', 1);
    let tme1 = '';
    let tme2 = '';
    let tme3 = '';
    let arraySize = array.length;
    array.forEach((item, index) => {
        addRowSheet2(wb, ws, index, item, 0);
        if (index == (arraySize - 1)) {
            tme1 += 'M' + (index + 2);
            tme2 += 'N' + (index + 2);
            tme3 += 'O' + (index + 2);
        } else {
            tme1 += 'M' + (index + 2) + '+';
            tme2 += 'N' + (index + 2) + '+';
            tme3 += 'O' + (index + 2) + '+';
        }
    });
    addTotalSheet1(ws, arraySize + 3, 12, '', 'Totales', 1);
    addTotalSheet1(ws, arraySize + 3, 13, tme1, 'Costo de Envio', 0);
    addTotalSheet1(ws, arraySize + 3, 14, tme2, 'Descuentos Aplicados al Costo de Envio (Aplicado por ShopStar al Cliente)', 0);
    addTotalSheet1(ws, arraySize + 3, 15, tme3, 'Costo de envio Asumido por ShopStar', 0);

}

function addSheet1(wb, ws, array, Epedidos) {
    addRowSheet1(wb, ws, -1, '', 1)
    let tqty = '';
    let tvtas = '';
    let tvtaf = '';
    let tctos = '';
    let tcoms = '';
    let arraySize = array.length;
    array.forEach((item, index) => {
        addRowSheet1(wb, ws, index, item, 0);
        if (index == (arraySize - 1)) {
            tqty += 'J' + (index + 2);
            tvtas += 'M' + (index + 2);
            tvtaf += 'N' + (index + 2);
            tctos += 'O' + (index + 2);
            tcoms += 'P' + (index + 2);
        } else {
            tqty += 'J' + (index + 2) + '+';
            tvtas += 'M' + (index + 2) + '+';
            tvtaf += 'N' + (index + 2) + '+';
            tctos += 'O' + (index + 2) + '+';
            tcoms += 'P' + (index + 2) + '+';
        }
    });
    addTotalSheet1(ws, arraySize + 3, 9, '', 'Total Cantidad', 1);
    addTotalSheet1(ws, arraySize + 3, 10, tqty, 'Cantidad de Pares de Calzados Vendidos', 0);
    addTotalSheet1(ws, arraySize + 3, 12, '', 'Totales', 1);
    addTotalSheet1(ws, arraySize + 3, 13, tvtas, 'Precio del Producto (Vendido por ShopStar al Cliente)', 0);
    addTotalSheet1(ws, arraySize + 3, 14, tvtaf, 'Precio del Producto (Vendido por Footloose a ShopStar)', 0);
    addTotalSheet1(ws, arraySize + 3, 15, tctos, 'Descuento Aplicado por Cupones o Promociones (Aplicado por ShopStar al Cliente)', 0);
    addTotalSheet1(ws, arraySize + 3, 16, tcoms, 'Comisión por la Venta del Producto', 0);

    addTotalSheet1(ws, arraySize + 5, 12, '', 'Total Costo de Envio', 1);
    addTotalSheet1(ws, arraySize + 5, 13, `='Costo de Envio'!O${Epedidos + 3}`, 'Descuento Aplicado por Cupones o Promociones al Costo de Envio (Aplicado por ShopStar al Cliente)', 0);

    addTotalSheet1(ws, arraySize + 7, 12, '', 'Cobro a ShopStar', 1);
    addTotalSheet1(ws, arraySize + 7, 13, `O${arraySize + 3}-P${arraySize + 3}+M${arraySize + 5}`, 'Dinero a Cobrar a ShopStar (Sin Descontar Total de Comisión)', 0);

    addTotalSheet1(ws, arraySize + 9, 12, '', 'N° de Pedidos', 1);
    addTotalSheet1(ws, arraySize + 9, 13, Epedidos, 'Total de Pedidos de ShopStar', 2);

    addTotalSheet1(ws, arraySize + 7, 15, '', 'Factura Passarela -> Shopstar', 1);
    addTotalSheet1(ws, arraySize + 7, 16, `O${arraySize + 3}+M${arraySize + 5}`, `Monto a Facturar Inversiones Rubin's a ShopStar`, 0);

    addTotalSheet1(ws, arraySize + 9, 15, '', 'Factura Shopstar -> Passarela', 1);
    addTotalSheet1(ws, arraySize + 9, 16, `P${arraySize + 3}`, `Monto a Facturar ShopStar a Inversiones Rubin's`, 0);
}

async function generateReport(fecha) {
    try {
        const connect = await pool;
        const result = await connect.request()
            .input('_fecha_reporte', mssql.VarChar, fecha)
            .execute("Ecommerce.dbo.sp_md_jobReporteShopStar");
        if (result.recordset[0].resultado && result.recordset[0].tipo && result.recordset[0].mensaje1 && result.recordset[0].mensaje2) {
            console.log("Error");
        } else {
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Reporte');
            const ws2 = wb.addWorksheet('Costo de Envio');
            let pedidosCant = result.recordsets[1].length;
            addSheet1(wb, ws, result.recordsets[0], pedidosCant);
            addSheet2(wb, ws2, result.recordsets[1]);
            ws.row(1).filter();
            ws.row(1).freeze();
            ws2.row(1).filter();
            ws2.row(1).freeze();
            let nameReport = `Reporte-ShopStar${Date.now()}.xlsx`;
            wb.write(`${url}/${nameReport}`);
        }
    } catch (error) {
        console.log(error)
    }
}

let shopstarReportUri = (date) => {
    let fecha = moment(date).add(1, 'M');
    fecha = moment(fecha).subtract(1, 'days').format('YYYYMMDD');
    generateReport(fecha);
}

let shopstarReportAuto = schedule.scheduleJob('0 0 0 1 * *', () => {
    let fecha = moment().subtract(1, 'days');
    fecha = moment(fecha).format('YYYYMMDD')
    generateReport(fecha);
});