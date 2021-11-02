'use strict'

const path = require('path');
const fetch = require('node-fetch');

let app_id = "2497956263375715";
let secret_key = "6VK6qqMqIaLAMYJTsKe0nIQ9ASv1HL69";
let redirect_uri = "http://localhost:3000/mercadolibre/auth/adquirerToken";

let vendedor = '437960080';

let mtdNewOrderML = async (req, res) => {

    const token = await fetch(`http://localhost:3000/mercadolibre/auth/tokenML`);
    console.log('token', token);

    if (token.status == 200) {

        const ruta = url.parse("https://www.mercadolibre.com/jms/mpe/lgz/login/?go=https%3A%2F%2Fauth.mercadolibre.com.pe%2Fauthorization%3Fresponse_type%3Dcode%26client_id%3D2497956263375715&platform_id=ml&application_id=2497956263375715")
        console.log('ruta', ruta);

        // res.writeHead(301, {'Location': 'https://www.mercadolibre.com/jms/mpe/lgz/login/?go=https%3A%2F%2Fauth.mercadolibre.com.pe%2Fauthorization%3Fresponse_type%3Dcode%26client_id%3D2497956263375715&platform_id=ml&application_id=2497956263375715'});
        // console.log('resultdata', resultdata)

        // const resultToken = await fetch(`http://localhost:3000/mercadolibre/auth/adquirerToken`);
        // const newToken = await resultToken.json();
        // console.log('newToken', newToken)
    }


    // const newOrder = await fetch(`https://api.mercadolibre.com/orders/search?seller=${vendedor}&order.status=paid&order.date_created.from=2020-02-22T09:00:00.000-03:00&order.date_created.to=2020-02-22T11:00:00.000-03:00&access_token=${token}`);
    // const resOrdenes = await newOrder.json();

    // console.log('resOrdenes', resOrdenes);

    // if (resOrdenes.status == 401) {
    //     return console.log("TIENE QUE ACTUALIZAR EL TOKEN");
    // }

}

module.exports = {
    mtdNewOrderML
}