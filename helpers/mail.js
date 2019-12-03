'use strict'
const path = require('path');
const nodemailer = require('nodemailer');
const config = require(path.join(process.cwd(), 'config', 'config.js')).config();

const sendMailHtml = async(data, owner) => {
    try {
        //Creamos el objeto de transporte
        const transporter = nodemailer.createTransport({
            //service: 'gmail',
            host: config.NODEMAILER.MAILING.HOST,
            port: config.NODEMAILER.MAILING.PORT,
            secure: config.NODEMAILER.MAILING.SECURE, // true for 465, false for other ports
            auth: {
                user: owner, //config.NODEMAILER.MAILING.USER,
                pass: config.NODEMAILER.MAILING.PASSWORD
            }
        });
        let mail = await transporter.sendMail(data);
        return mail.response;
    } catch (err) {
        throw err;
    }
}
module.exports = {
    sendMailHtml
}