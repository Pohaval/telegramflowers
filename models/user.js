const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  age: Number,
  password: String,
  token: String,
});

module.exports = mongoose.model('User', userSchema);
