'use strict'
let checkStatus =async (res) =>{
    if (res.ok) {
        return res.json();
    } else {
        let msgError = await res.json();
        throw JSON.stringify({
            body: msgError
        })
    }
}
let checkStatus2 =async (res) =>{
    if (res.ok) {
        return res;
    } else {
        let msgError = await res.json();
        throw JSON.stringify({
            body: msgError
        })
    }
}
module.exports = {
    checkStatus,
    checkStatus2
}