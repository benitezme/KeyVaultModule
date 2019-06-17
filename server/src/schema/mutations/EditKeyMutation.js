import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

import {
  AuthenticationError,
  KeyVaultError
} from '../../errors'

import { KeyType } from '../types'
import { Key } from '../../models'
import logger from '../../config/logger'
import saveAuditLog from './AddAuditLog'
import { isDefined } from '../../utils'

const args = {
  id: {type: new GraphQLNonNull(GraphQLID)},
  description: {type: GraphQLString},
  validFrom: {type: GraphQLInt},
  validTo: {type: GraphQLInt},
  active: {type: GraphQLBoolean},
  defaultKey: {type: GraphQLBoolean}
}

const resolve = async (parent, { id, description, validFrom, validTo, active,
                  defaultKey }, context) => {
  logger.debug('editKey -> Entering Fuction.')

  if (!context.userId) {
    throw new AuthenticationError()
  }

  try {
    if (defaultKey) {
      logger.debug('editKey -> Default Key Changed.')
      let currentDefaultKey = await Key.findOne({
        authId: context.userId,
        defaultKey: true
      })

      if (isDefined(currentDefaultKey) && currentDefaultKey.id !== id) {
        if (currentDefaultKey.activeCloneId.length > 0) {
          throw new WrongArgumentsError('editKey -> The existing key can not be selected as default since it is in use.')
        } else {
          logger.debug('editKey -> Changing old default key.')
          currentDefaultKey.defaultKey = false
          await currentDefaultKey.save()
        }
      }
    }

    var query = {
      _id: id,
      authId: context.userId
    }
    var options = { new: true}
    let update = {
      description: description,
      validFrom: validFrom,
      validTo: validTo,
      active: active,
      defaultKey: defaultKey
    }

    await saveAuditLog(id, 'editKey', context)

    logger.debug('editKey -> Editing key.')
    return Key.findOneAndUpdate(query, update, options)
  } catch (error) {
    logger.error('editKey -> Error Editing key. %s', error.stack)
    throw new KeyVaultError('Error Editing key. ' + error.message)
  }
}

const EditKeyMutation = {
  editKey: {
    type: KeyType,
    args,
    resolve
  }
}

export default EditKeyMutation
