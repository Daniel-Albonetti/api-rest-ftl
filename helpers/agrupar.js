/*==========================================
TODO: INICIO METODO AGRUPA POR CATEGORIA WEB
============================================*/

const agruparPorGenero = (array)=>{

    let arr;
    var palabra = array.reduce(function(valor_anterior, valor_actual, index, arreglo) {

    if (index == 1) {

        if (valor_anterior.detalle_producto.nombre_web == valor_actual.detalle_producto.nombre_web) {

            arr = [
                [valor_anterior, valor_actual]
            ];


        } else {

            arr = [
                [valor_anterior],
                [valor_actual]
            ];

        }

    }else {

        let aux = true;

        for (let i = 0; i < arr.length; i++) {

            if (arr[i][0].detalle_producto.nombre_web == valor_actual.detalle_producto.nombre_web) {
                arr[i].push(valor_actual);
                aux = false;
            }
        }


        if (aux) {
            arr.push([valor_actual]);
        }

    }

    return arr;

})

return palabra;

}

/*========================================
FIXME: FIN METODO AGRUPA POR CATEGORIA WEB
==========================================*/

/*==========================================
TODO: INICIO METODO AGRUPA POR CATEGORIA WEB
============================================*/

const agruparPorDescripcion = (array)=>{

    let arr;
    var palabra = array.reduce(function(valor_anterior, valor_actual, index, arreglo) {

    if (index == 1) {

        if (valor_anterior.detalle_producto.descripcion == valor_actual.detalle_producto.descripcion) {

            arr = [
                [valor_anterior, valor_actual]
            ];


        } else {

            arr = [
                [valor_anterior],
                [valor_actual]
            ];

        }

    }else {

        let aux = true;

        for (let i = 0; i < arr.length; i++) {

            if (arr[i][0].detalle_producto.descripcion == valor_actual.detalle_producto.descripcion) {
                arr[i].push(valor_actual);
                aux = false;
            }
        }


        if (aux) {
            arr.push([valor_actual]);
        }

    }

    return arr;

})

return palabra;

}

/*========================================
FIXME: FIN METODO AGRUPA POR CATEGORIA WEB
==========================================*/

/*==========================================
TODO: INICIO METODO AGRUPA POR CATEGORIA WEB
============================================*/

const agruparPorColor = (array)=>{

    let arr;
    var palabra = array.reduce(function(valor_anterior, valor_actual, index, arreglo) {

    if (index == 1) {

        if (valor_anterior.detalle_producto.colores.toString() == valor_actual.detalle_producto.colores.toString()) {

            arr = [
                [valor_anterior, valor_actual]
            ];


        } else {

            arr = [
                [valor_anterior],
                [valor_actual]
            ];

        }

    }else {

        let aux = true;

        for (let i = 0; i < arr.length; i++) {

            if (arr[i][0].detalle_producto.colores.toString() == valor_actual.detalle_producto.colores.toString()) {
                arr[i].push(valor_actual);
                aux = false;
            }
        }


        if (aux) {
            arr.push([valor_actual]);
        }

    }

    return arr;

})

return palabra;

}

/*========================================
FIXME: FIN METODO AGRUPA POR CATEGORIA WEB
==========================================*/

module.exports = {
    agruparPorDescripcion,
    agruparPorGenero,
    agruparPorColor
}