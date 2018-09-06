const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditLogSchema = new Schema({
  authId: String,
  keyId: String,
  action: String,
  details: String,
  date: String
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
