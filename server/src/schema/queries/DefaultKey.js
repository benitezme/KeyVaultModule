import {
  AuthentificationError,
  KeyVaultError
} from '../../errors'

import { KeyType } from '../types'
import { Key } from '../../models'
import logger from '../../config/logger'

const args = {}

const resolve = (parent, args, context) => {
  logger.debug('defaultKey -> Entering Fuction.')

  try {
    if (!context.userId) {
      throw new AuthentificationError()
    }

    return Key.findOne({
      authId: context.userId,
      defaultKey: true
    })

  } catch (error) {
    logger.error('defaultKey -> Error getting default key. %s', error.stack)
    throw new KeyVaultError('Error getting default key. ' + error.message)
  }
}

const DefaultKey = {
  defaultKey: {
    type: KeyType,
    args,
    resolve
  }
}

export default DefaultKey
