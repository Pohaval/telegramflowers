const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const optionsSchema = new Schema({
  canCreateNewConfig: Boolean,
});

module.exports = mongoose.model('Option', optionsSchema);
