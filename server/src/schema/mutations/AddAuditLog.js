
import { AuditLog } from '../../models'
import logger from '../../config/logger'

const AddAuditLog = (keyId, action, context, details) => {
  let localDate = new Date()
  let date = new Date(Date.UTC(
    localDate.getUTCFullYear(),
    localDate.getUTCMonth(),
    localDate.getUTCDate(),
    localDate.getUTCHours(),
    localDate.getUTCMinutes(),
    localDate.getUTCSeconds()).valueOf() / 1000
  )

  var auditLogEntry = new AuditLog({
    authId: context.userId,
    keyId: keyId,
    action: action,
    details: details,
    date: date
  })

  logger.debug('saveAuditLog -> Saving a new Audit Log Record.')
  auditLogEntry.save()
}

export default AddAuditLog
