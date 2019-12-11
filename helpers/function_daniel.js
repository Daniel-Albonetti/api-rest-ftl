'use strict'
/*========================================
FUNCIONES DE .....
==========================================*/

const groupBy = function (miarray, prop) {
    return miarray.reduce(function(groups, item) {
        var val = item[prop];
        groups[val] = groups[val] || {Codigointerno: item.Codigointerno, Tda: item.Tda, stock: 0, precioetiqueta: 0, precioventa: 0};
        groups[val].stock += item.stock;
        groups[val].precioetiqueta = item.precioetiqueta;
        groups[val].precioventa = item.precioventa;
        return groups;
    }, {});
}

function eliminarObjetosDuplicados(arr, prop) {
    var nuevoArray = [];
    var lookup  = {};

    for (var i in arr) {
        lookup[arr[i][prop]] = arr[i];
    }

    for (i in lookup) {

        nuevoArray.push(lookup[i]);
    }

    return nuevoArray;
}

/*========================================
FUNCIONES DE .....
==========================================*/


module.exports = {
    groupBy,
    eliminarObjetosDuplicados
}