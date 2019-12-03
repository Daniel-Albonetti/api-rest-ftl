'use strict'

const path = require('path');

const {
    setStock
} = require(path.join(__dirname, 'vtex.js'));

let attempSetStock = async (data) => {
    let attemp = 0;
    let attempsNumber = 3;
    for (let i = 1; i < attempsNumber; i++) {
        let setedStock = setStock(data);
    }
}
