const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserTelegram = new Schema({
  name: String,
  telegram_id: String,
  admin: Boolean,
  lastDayGet: Number,
  todayCount: Number,
  history: Array,
  transferRx: Number,
  transferTx: Number,
  totalTx: Number,
  totalRx: Number,

});

module.exports = {
  UserTelegram: mongoose.model('UserTelegram', UserTelegram),
  schema: UserTelegram,
};
