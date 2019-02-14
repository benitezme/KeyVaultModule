import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString
} from 'graphql'

import {
  AuthentificationError,
  KeyVaultError
} from '../../errors'

import { Key } from '../../models'
import logger from '../../config/logger'
import saveAuditLog from './AddAuditLog'

const args = {
  id: {type: new GraphQLNonNull(GraphQLID)}
}

const resolve = async (parent, { id }, context) => {
  logger.debug('removeKey -> Entering Fuction.')

  if (!context.userId) {
    throw new AuthentificationError()
  }

  try {
    await saveAuditLog(id, 'removeKey', context)

    logger.debug('removeKey -> Removing key.')
    await Key.deleteOne({
      _id: id,
      authId: context.userId
    })

    return 'Key Removed'
  } catch (error) {
    logger.error('removeKey -> Error removing key. %s', error.stack)
    throw new KeyVaultError('Error removing key', error.message)
  }
}

const RemoveKeyMutation = {
  removeKey: {
    type: GraphQLString,
    args,
    resolve
  }
}

export default RemoveKeyMutation
