import {
  GraphQLList
} from 'graphql'

import {
  AuthenticationError,
  KeyVaultError
} from '../../errors'

import { KeyType } from '../types'
import { Key } from '../../models'
import logger from '../../config/logger'

const args = {}

const resolve = (parent, args, context) => {
  logger.debug('availableKeys -> Entering Fuction.')

  try {
    if (!context.userId) {
      throw new AuthenticationError()
    }

    return Key.find({
      authId: context.userId,
      activeCloneId: '',
      defaultKey: false
    })
  } catch (error) {
    logger.error('availableKeys -> Error getting available keys. %s', error.stack)
    throw new KeyVaultError('Error getting available keys. ' + error.message)
  }
}

const AvailableKeys = {
  availableKeys: {
    type: new GraphQLList(KeyType),
    args,
    resolve
  }
}

export default AvailableKeys
