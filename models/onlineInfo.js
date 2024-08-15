const mongoose = require('mongoose');
const { schema } = require('./userTelegram');

const Schema = mongoose.Schema;

const infoSchema = new Schema({
  date: Date,
  count: Number,
  users: [schema],
});

module.exports = mongoose.model('onlineInfo', infoSchema);
