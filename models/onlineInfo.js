const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const onlineInfoUserSchema = new Schema({
  user: {
    id: String,
    name: String,
  },
  key: String,
  latestHandshake: Number,
  transferRx: Number,
  transferTx: Number,
  totalRx: Number,
  totalTx: Number,
}, { _id: false });

const infoSchema = new Schema({
  date: Date,
  count: Number,
  transferRx: Number,
  transferTx: Number,
  totalRx: Number,
  totalTx: Number,
  users: [onlineInfoUserSchema],
}, { timestamps: true });

module.exports = mongoose.model('onlineInfo', infoSchema);
