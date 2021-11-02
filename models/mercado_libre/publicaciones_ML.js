/*===================================
REQUIRINEDO MONGOOSE
=====================================*/

const { model, Schema } = require('mongoose');

const publicacionesMlSchema = new Schema({

    id_publicacion: { type: String, maxlength: 20, required: true },
    site_id: { type: String, maxlength: 20, required: true },
    title: { type: String, maxlength: 60, required: true },
    category_id: { type: String, maxlength: 50, required: true },
    currency_id: { type: String, maxlength: 3, required: true },
    condition: { type: String, maxlength: 20, required: true },
    buying_mode: { type: String, maxlength: 20, required: true },
    listing_type_id: { type: String, maxlength: 50, required: true },
    description: {
        plain_text: {type: String}
    },
    attributes: [ { } ],
    warranty: { type: String, maxlength: 50, required: true },
    pictures: [ { } ],
    shipping: {
        mode: { type: String, maxlength: 50 },
        local_pick_up: { type: Boolean },
        free_shipping: { type: Boolean },
        costs: [ { } ],
    },
    permalink: { type: String, required: true },
    variations: [ { } ],
    date_created: { type: Date, required: true }

})

const publicaciones_ml = model('publicaciones_ml', publicacionesMlSchema);

module.exports = publicaciones_ml;