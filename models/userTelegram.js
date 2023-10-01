const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userTelegram = new Schema({
  name: String,
  telegram_id: String,
  admin: Boolean,
  lastDayGet: Number,
  todayCount: Number,
  history: Array,
});

module.exports = mongoose.model('userTelegram', userTelegram);
