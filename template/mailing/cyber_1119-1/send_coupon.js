'use strict'

let sendCoupon = (data) => {
    try {
        let coupon = data.coupon;
        let name = data.name;
        let html = `
        <table style="background-color: #d2d3d5; width: 100%; ">
        <tbody>
            <tr>
                <td align="center" style="padding-top: 20px;padding-bottom: 20px;">
                    <table cellspacing="0" cellpadding="0" style="border: none;font-family:'Helvetica','Arial',sans-serif; width: 750px; background: #d2d3d5; ">
                        <thead>
                            <tr>
                                <th align="center" style="height: 70px; background-color: #391f4f;">
                                    <img src="https://footloose.vteximg.com.br/arquivos/mail-logo-ftl1.png" alt="logo-footloose" style="width: 320px;" />
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            style="background: url('https://footloose.vteximg.com.br/arquivos/mail-fondo1.png'); background-size:100% 100%; background-repeat: no-repeat;">
                            <tr>
                                <td>
                                    <table style="width: 100%;">
                                        <thead>
                                            <tr>
                                                <th align="center">
                                                    <table
                                                        style="color: #391f4f; border: 2px solid #E42217; width: 650px; padding: 50px; margin-top: 30px; ">
                                                        <tbody>
                                                            <tr>
                                                                <td align="center" style="height: 120px; font-size: 20px;">
                                                                    <p>
                                                                        FELICIDADES, <span
                                                                            style="color: #E42217;">${name}</span>
                                                                        <br />
                                                                        Ganaste un descuento exclusivo por completar la
                                                                        encuesta en
                                                                        <a style="color: #E42217;text-decoration: none;"
                                                                            href="http://www.footloose.pe">Footloose.pe</a>
                                                                        <br />
                                                                        Recuerda que para disfrutar de este beneficio,
                                                                        deberás ingresar
                                                                        el siguiente código de descuento antes de finalizar
                                                                        tu compra.
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" style="height: 100px; font-size: 20px;">
                                                                    <p>
                                                                        <img src="https://footloose.vteximg.com.br/arquivos/mail-icon-gift1.png" alt="gift-img"
                                                                            style="padding-top: 20px;" />
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <p
                                                                        style="font-size: 22px;width: 180px; color: #E42217;">
                                                                        <b>${coupon}</b>
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" style="height: 80px;">
                                                                    <a style="vertical-align: middle; border-radius: 10px; padding: 1em 1.5em;background-color: #E42217;color: white;text-decoration: none;"
                                                                        href="http://www.footloose.pe">Canjear Ahora</a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody
                                            style="color: #391f4f; margin-top: 30px; border: 2px solid #E42217; width: 550px; padding: 50px;">
                                            <tr>
                                                <td align="center" style="height: 60px; font-size: 15px;">
                                                    <p>
                                                        <b><span style="color: #E42217;">Síguenos en</span></b>
                                                        <a style="text-decoration: none;"
                                                            href="https://www.facebook.com/footloose.pe/">
                                                            <img src="https://footloose.vteximg.com.br/arquivos/mail-logo-fb1.png" alt="logo-facebook"
                                                                style="width: 30px; height: 30px;vertical-align: middle; " />
                                                        </a>
                                                        <a style="text-decoration: none;"
                                                            href="https://www.instagram.com/footloose.pe/">
                                                            <img src="https://footloose.vteximg.com.br/arquivos/mail-logo-istg1.png" alt="logo-instagram"
                                                                style="width: 30px; height: 30px;vertical-align: middle; " />
                                                        </a>
                                                        <a style="text-decoration: none;"
                                                            href="https://www.youtube.com/channel/UCmmvz2aoDcbwdyEHP80ku7Q/featured">
                                                            <img src="https://footloose.vteximg.com.br/arquivos/mail-logo-yt1.png" alt="logo-youtube"
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
                                <td align="center" style="background-color: #ffffff;">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td align="center" style="height: 80px;">
                                                    <p
                                                        style="border-radius: 15px; width: 150px; color:#ffffff ; background-color: #391f4f; padding: 10px; margin-top:5px ;">
                                                        <b> Además
                                                            recuerda: </b></p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="height: 200px;">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <table style="width: 80px; color: #391f4f;">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center">
                                                                                    <p
                                                                                        style="border: 2.5px solid #391f4f; color: #391f4f; border-radius: 10px;padding: 10px 32px;">
                                                                                        <img src="https://footloose.vteximg.com.br/arquivos/mail-icon-card1.png"
                                                                                            alt="logo-card"
                                                                                            style="padding: 10px;" />
                                                                                        <br />
                                                                                        Paga con<br/> cualquier<br/> medio<br/> de pago
                                                                                    </p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                                <td>
                                                                    <table style="width: 80px;">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center">
                                                                                    <p
                                                                                        style="border: 2.5px solid #391f4f;color: #391f4f; border-radius: 10px;padding: 20px 36px;">
                                                                                        <img src="https://footloose.vteximg.com.br/arquivos/mail-icon-car1.png"
                                                                                            alt="logo-car"
                                                                                            style="padding: 10px;" />
                                                                                        <br />
                                                                                        Envios<br/> a todo <br/>el<br/> Perú
                                                                                    </p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                                <td>
                                                                    <table style="width: 80px;">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td align="center">
                                                                                    <p
                                                                                        style="border: 2.5px solid #391f4f;color: #391f4f; border-radius: 10px;padding: 20px 32px;">
                                                                                        <img src="https://footloose.vteximg.com.br/arquivos/mail-icon-dly1.png"
                                                                                            alt="logo-delivery"
                                                                                            style="padding: 10px;" />
                                                                                        <br />
                                                                                        Delivery <br/>gratis<br/> desde <br/>S/. 199
                                                                                    </p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="height: 80px;">
                                                    <p
                                                        style="width: 450px; color:#ffffff ; background-color: #391f4f; padding: 10px; margin-top:5px ;">
                                                        <b> ¿Tienes dudas sobre cómo hacer tu compra online?</b></p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <table>
                                                        <tr>
                                                            <td style="height: 100px;">
                                                                <table style="width: 300px;">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>
                                                                                <img src="https://footloose.vteximg.com.br/arquivos/mail-icon-car2.png"
                                                                                    alt="logo-car"
                                                                                    style="vertical-align: middle; " />
                                                                            </td>
                                                                            <td>
                                                                                <p style="font-size: 16px; color: #391f4f;">
                                                                                    <b><a style="color: #E42217;text-decoration: none;"
                                                                                            href="http://www.footloose.pe">COMPRAS
                                                                                            ONLINE</a></b><br />
                                                                                    ¡Mira este video y descubre lo fácil,
                                                                                    rápido y
                                                                                    seguro que es!
                                                                                </p>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                            <td>
                                                                <table style="width: 300px;">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td>
                                                                                <img src="https://footloose.vteximg.com.br/arquivos/mail-icon-ign1.png"
                                                                                    alt="logo-invognito"
                                                                                    style="vertical-align: middle; " />
                                                                            </td>
                                                                            <td>
                                                                                <p style="font-size: 16px;color: #391f4f;">
                                                                                    <b><a style="color: #E42217;text-decoration: none;"
                                                                                            href="http://www.footloose.pe/preguntas-frecuentes">PREGUNTAS
                                                                                            FRECUENTES
                                                                                        </a></b><br />
                                                                                    Obtén las respuestas a tus preguntas con
                                                                                    solo un
                                                                                    click.
                                                                                </p>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="height: 80px;">
                                                    <p
                                                        style="width: 450px; color:#ffffff ; background-color: #391f4f; padding: 10px; margin-top:5px ;">
                                                        <b> ¿Necesitas ayuda? No dudes en contactarnos</b></p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <table>
                                                        <tr>
                                                            <td align="center" style="height: 210px;">
                                                                <table style="width: 500px; font-size: 16;">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td align="center">
                                                                                <p style="margin-top: -38px; color: #391f4f;">
                                                                                    <span
                                                                                        style="color: #E42217;">CHATEA</span>
                                                                                    CON NOSOTROS
                                                                                    <br />
                                                                                    <img src="https://footloose.vteximg.com.br/arquivos/mail-icon-msg1.png"
                                                                                        alt="logo-msg"
                                                                                        style="margin-bottom: 10px; margin-top: 10px; vertical-align: middle; " />
                                                                                    <br />
                                                                                    <b><a style="color: #E42217;text-decoration: none;"
                                                                                            href="http://m.me/footloose.pe">m.me/footloose.pe</a></b>
                                                                                </p>
                                                                            </td>
                                                                            <td align="center">
                                                                                <p style="margin-top: -38px;color: #391f4f;">
                                                                                    <span
                                                                                        style="color: #E42217;">FONO</span><span>COMPRAS</span>
                                                                                    LLÁMANOS
                                                                                    <br />
                                                                                    <img src="https://footloose.vteximg.com.br/arquivos/mail-icon-iph1.png"
                                                                                        alt="logo-fono"
                                                                                        style="margin-bottom: 10px; margin-top: 10px;vertical-align: middle; " />
                                                                                    <br />
                                                                                    <b><a style="color: #E42217;text-decoration: none;"
                                                                                            href="tel:017482402">(01)
                                                                                            7482402</a></b>
                                                                                </p>
                                                                            </td>
                                                                            <td align="center">
                                                                                <p style="color: #391f4f;">
                                                                                    O ESCRÍBENOS AL
                                                                                    <br />
                                                                                    <img src="https://footloose.vteximg.com.br/arquivos/mail-icon-fnp1.png"
                                                                                        alt="logo-wts"
                                                                                        style="padding-top: 10px;vertical-align: middle; " />
                                                                                    <br />
                                                                                    <p>
                                                                                        <b><a style="color: #E42217;text-decoration: none;"
                                                                                                href="https://wa.me/51936121553">936121553</a></b><br />
                                                                                        <b><a style="color: #E42217;text-decoration: none;"
                                                                                                href="https://wa.me/51989114786">989114786</a></b>
                                                                                    </p>
                                                                                </p>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="height: 70px; background-color: #391f4f;">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td align="center">
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
    sendCoupon
}