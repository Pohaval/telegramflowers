const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Image = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  file: {
    data: Buffer,
    contentType: String,
  },
  prediction_id: String,
});

module.exports = mongoose.model('Image', Image);
