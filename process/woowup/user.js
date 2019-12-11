'use strict'
const path = require('path');
const User = require(path.join(process.cwd(), 'models', 'woowup', 'user.js'));
const util = require('util');
const sleep = util.promisify(setTimeout);

const {
    pool,
    mssql
} = require(path.join(process.cwd(), 'config', 'database.js'));

const {
    existUser,
    createUser,
    updateUser
} = require(path.join(process.cwd(), 'helpers', 'woowup.js'));


async function getUsers() {
    try {
        const connect = await pool;
        const result = await connect.request()
            .input('_flag_upd', mssql.Bit, 1)
            .query(`SELECT ts.email, tsc.nombre
                FROM  Ecommerce.ecommerce.tmp_suscriptor AS ts
                INNER JOIN Ecommerce.ecommerce.tb_sitio_captura AS tsc
                ON  tsc.id = ts.tb_sitio_captura_id
                WHERE  ts.flag_upd = @_flag_upd
                `);
        return result.recordset;
    } catch (error) {
        throw new Error(error)
    }
}

async function updUser(email){
    try {
        const connect = await pool;
        const result = await connect.request()
            .input('_email', mssql.VarChar, email)
            .query(`UPDATE Ecommerce.ecommerce.tmp_suscriptor
                    SET flag_upd = 0
                    WHERE email = @_email
                `);
        return result.rowsAffected[0];
        
    } catch (error) {
        throw new Error(error)
    }
}

function sendWoowUp(user) {
    try {
        if (existUser(user.email)) {
            updateUser(user);
        } else {
            createUser(user);
        }
        updUser(user.email);
    } catch (error) {
        console.log('error', error)
    }
}

async function setUser(data) {
    try {
        let time = Math.ceil(Math.random() * 5000);
        let user = new User();
        user.email = data.email;
        user.tags = data.nombre;
        let rsp = user.prepareUser();
        await sleep(time);
        sendWoowUp(rsp);
    } catch (error) {
        console.log('error', error)
    }
}

let usersWoowUp = async () => {
    try {
        let listUser = await getUsers();
        let listUserSize = listUser.length;
        let steps = 0;
        for (let i = 0; i < listUserSize; i++) {
            steps++;
            if (steps == 200) {
                await sleep(30000);
                steps = 0;
            }
            setUser(listUser[i])
        }
    } catch (err) {
        console.log('usersWoowUp =>', err)
    }
}

module.exports = {
    usersWoowUp
}
