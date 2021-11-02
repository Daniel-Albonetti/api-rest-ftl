'use strict'

const path = require('path');

const ctrTokenMercadoLibre = {};

const config = require(path.join(process.cwd(), 'config', 'config.js')).config();
const urlCode = require(path.join(process.cwd(), 'helpers', 'valor_url.js'));

let credentials = {
    clientId: config.CREDENTIALS.MERCADOLIBRE.CLIENTID,
    clientSecret: config.CREDENTIALS.MERCADOLIBRE.CLIENTSECRET
}

/*===============================
METODO DELETE | /tokenML
=================================*/

ctrTokenMercadoLibre.token = async (req, res, next) => {

    try {

        return res.redirect(`https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=2497956263375715`);

    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR LINK MERCADOLIBRE'});
        next(e);
    }

}


/*===============================
METODO DELETE | /adquirerToken
=================================*/

ctrTokenMercadoLibre.adquirerToken = async (req, res, next) => {

    try {

        let codeToken = urlCode.obtenerValorParametro('code');

        res.status(200).json({code: codeToken});

    } catch (e) {
        res.status(500).json({ok: false, mensaje: 'ERROR CODE TOKEN MERCADOLIBRE'});
        next(e);
    }

}


module.exports = ctrTokenMercadoLibre;