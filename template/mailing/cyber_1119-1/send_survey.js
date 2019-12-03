'use strict'
const path = require('path');
const config = require(path.join(process.cwd(), 'config', 'config.js')).config();
const {
    encrypt
} = require(path.join(process.cwd(), 'helpers', 'crypto.js'));

let secret = config.CRYPTO.MAIL.SECRET;


let sendSurvey = (data) => {
    try {
        let info = JSON.stringify(data);
        let name = data.name;
        let encrypted = '2' + encrypt(info, secret);
        let html = `
<table style="background-color: #d2d3d5; width: 100%;">
    <tbody>
        <tr>
            <td align="center" style="padding-top: 20px;padding-bottom: 20px;">
                <table cellspacing="0" cellpadding="0" style="font-family:'Helvetica','Arial',sans-serif; background-color: #d2d3d5; width: 550px; ">
                    <thead>
                        <tr>
                            <th align="center" style="height: 70px; background-color: #391f4f;">
                                <img src="https://footloose.vteximg.com.br/arquivos/mail-logo-ftl1.png" alt="logo-footloose"/>
                            </th>
                        </tr>
                    </thead>
                    <tbody style="background-image: url('https://footloose.vteximg.com.br/arquivos/mail-fondo1.png');" >
                        <tr>
                            <td>
                                <table style="width: 100%;">
                                    <tbody style="color: #391f4f;">
                                        <tr>
                                            <td align="center" style="height: 120px; font-size: 20px;">
                                                <p>
                                                   <b><span style="font-size: 25px;">${name}</span></b>
                                                    <br />
                                                    Gracias por tu compra en
                                                        <a style="color: #E42217;text-decoration: none;"
                                                        href="http://www.footloose.pe">Footloose.pe</a>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="height: 70px; font-size: 20px;">
                                                <p>
                                                    <span style="color: #E42217;">¡COMPARTE TU EXPERIENCIA CON NOSOTROS!</span>
                                                    <br />
                                                    Y obten un <b><span style="color: #391f4f; font-weight: 20px;font-size: 26px;">10%</span> <span
                                                        style="color: #391f4f;">de descuento</span></b>
                                                    en tu próxima compra
                                                    <br />
                                                    online
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="height: 150px; font-size: 19px;">
                                                <p style="text-align: justify;width: 500px;">
                                                    En Footloose estamos comprometidos con brindarte
                                                    la mejor experiencia de compra. Por ello, nos gustaría
                                                    conocer tu opinión con respecto a tu compra online y
                                                    retiro en la tienda Footloose. ¡Sólo tomará unos segundos!
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="height: 40px;">
                                                <a style="vertical-align: middle; border-radius: 10px; padding: 1em 1.5em;background-color: #E42217;color: white;text-decoration: none;"
                                                    href="http://www.footloose.pe/encuesta-cyber#utm_source=4c5e86ca795c27829a56d17e5185ba26d34793bacfb785d37c8621343ed6b23f&utm_campaign=${encrypted}&utm_content=54856b34dfd310429ff41be3f6fe6219118494cf8365ad3216e7138923ac0ff6">INICIAR ENCUESTA</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="height: 80px; font-size: 18px;">
                                                <p>
                                                    <b>¡Gracias por tu tiempo, comentarios y preferencias!</b>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="height: 60px; font-size: 15px;">
                                                <p>
                                                    <b><span style="color: #E42217;">Síguenos en</span></b>
                                                    <a style="text-decoration: none;"
                                                        href="https://www.facebook.com/footloose.pe/">
                                                        <img src="https://footloose.vteximg.com.br/arquivos/mail-logo-fb1.png"
                                                            alt="logo-facebook"
                                                            style="width: 30px; height: 30px;vertical-align: middle; " />
                                                    </a>
                                                    <a style="text-decoration: none;"
                                                        href="https://www.instagram.com/footloose.pe/">
                                                        <img src="https://footloose.vteximg.com.br/arquivos/mail-logo-istg1.png"
                                                            alt="logo-instagram"
                                                            style="width: 30px; height: 30px;vertical-align: middle; " />
                                                    </a>
                                                    <a style="text-decoration: none;"
                                                        href="https://www.youtube.com/channel/UCmmvz2aoDcbwdyEHP80ku7Q/featured">
                                                        <img src="https://footloose.vteximg.com.br/arquivos/mail-logo-yt1.png"
                                                            alt="logo-youtube"
                                                            style="width: 30px; height: 30px;vertical-align: middle; " />
                                                    </a>
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td align="center" style="height: 70px; background-color: #391f4f;">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td align="center" >
                                                <p style="color: white;">
                                                    TIENDA ONLINE
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="border-top: 2px solid #E42217;">
                                                <p>
                                                    <a style="color: white;text-decoration: none;"
                                                        href="http://www.footloose.pe">www.footloose.pe</a>
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </td>
        </tr>
    </tbody>
</table>
    `;
        return html;
    } catch (e) {
        throw e
    }
}

module.exports = {
    sendSurvey
}