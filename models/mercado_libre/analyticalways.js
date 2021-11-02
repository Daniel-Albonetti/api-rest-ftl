/*====================================
SCHEMA ANALYTICALWAYS
======================================*/

const { model, Schema } = require('mongoose');

const analyticAlwaysSchema = new Schema({

    ProductCode : { type: String, maxlength: 12, required: true },
    RootCode: { type: String, maxlength: 12 },
    EAN: { type: String, maxlength: 20 },
    Description: { type: String, maxlength: 100 },
    Cost: { type: Number },
    Price: { type: Number },
    Categorization: {
        Marca: { type: String, maxlength: 50 },
        Modelo: { type: String, maxlength: 50 },
        Color: { type: String, maxlength: 50 },
        Genero: { type: String, maxlength: 50 },
        ArticuloDesc: { type: String, maxlength: 50 },
        Temporada: { type: String, maxlength: 50 },
        NombreWeb: { type: String, maxlength: 50 },
    },
    MinimumOrder: { type: Number },
    OrdMultiplo: { type: Number },
    thumbnailUrl: { type: String },
    Size: { type: Number },

})

const analyticalways = model('analyticalways', analyticAlwaysSchema);

module.exports = analyticalways;