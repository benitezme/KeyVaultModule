import mongoose, { Schema } from 'mongoose'

const keySchema = new Schema({
  authId: String,
  key: String,
  secret: String,
  description: String,
  exchange: String,
  validFrom: String,
  validTo: String,
  active: Boolean,
  defaultKey: Boolean,
  activeCloneId: String,
  acceptedTermsOfService: Boolean,
  access_token: String
})

export default mongoose.model('Key', keySchema)
