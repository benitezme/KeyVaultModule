import mongoose, { Schema } from 'mongoose'

const auditLogSchema = new Schema({
  authId: String,
  keyId: String,
  action: String,
  details: String,
  date: Number
})

export default mongoose.model('AuditLog', auditLogSchema)
