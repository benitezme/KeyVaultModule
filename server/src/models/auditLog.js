import mongoose, { Schema } from 'mongoose'

const auditLogSchema = new Schema({
  authId: String,
  keyId: String,
  action: String,
  details: String,
  date: String
})

module.exports = mongoose.model('AuditLog', auditLogSchema)
