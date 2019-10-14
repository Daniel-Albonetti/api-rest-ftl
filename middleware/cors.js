'use strict'

let cors = (req, res, next) => {
    var origin = req.get('origin');
    console.log(origin);
    next();
}


module.exports = {
    cors
}