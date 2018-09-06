const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keySchema = new Schema({
  authId: String,
  key: String,
  secret: String,
  type: String,
  description: String,
  exchange: String,
  validFrom: String,
  validTo: String,
  active: Boolean,
  botId: String
});

module.exports = mongoose.model('Key', keySchema);
