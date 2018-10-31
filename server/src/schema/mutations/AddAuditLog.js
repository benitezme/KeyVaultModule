
import { AuditLog } from '../../models'
import logger from '../../config/logger'

const saveAuditLog = (keyId, action, context, details) => {
  let localDate = new Date()
  let date = new Date(Date.UTC(
    localDate.getUTCFullYear(),
    localDate.getUTCMonth(),
    localDate.getUTCDate(),
    localDate.getUTCHours(),
    localDate.getUTCMinutes(),
    localDate.getUTCSeconds(),
    localDate.getUTCMilliseconds())
  )

  var auditLogEntry = new AuditLog({
    authId: context.userId,
    keyId: keyId,
    action: action,
    details: details,
    date: date.toISOString()
  })

  logger.info('saveAuditLog -> Saving a new Audit Log Record.')
  auditLogEntry.save()
}

export default saveAuditLog
