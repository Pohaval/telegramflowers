const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Prediction = new Schema({
    text: String,
    created_by: String,
    image_id: String,
});

module.exports = mongoose.model('Prediction', Prediction);
