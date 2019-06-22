import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

import {
  AuthenticationError,
  WrongArgumentsError,
  KeyVaultError
} from '../../errors'

import { Key } from '../../models'
import logger from '../../config/logger'
import saveAuditLog from './AddAuditLog'
import { isDefined } from '../../utils'
import isUserAuthorized from '../../graphQLCalls/isUserAuthorized'
import crypto from 'crypto'
import _ from 'lodash'

const args = {
  keyId: {type: new GraphQLNonNull(GraphQLString)},
  cloneId: {type: new GraphQLNonNull(GraphQLString)},
  releaseClon: {type: new GraphQLNonNull(GraphQLBoolean)}
}

const resolve = async (parent, { keyId, cloneId, releaseClon}, context) => {
  logger.debug('authorizeClone -> Entering function.')

  if (!context.userId) {
    throw new AuthenticationError()
  }

  try {
    logger.debug('authorizeClone -> checking clone authorization.')
    let authorized = await isUserAuthorized(context.authorization, cloneId, context.userId)
    if (!authorized) {
      throw new WrongArgumentsError('You are not eligible to authorize this clone.')
    }

    logger.debug('authorizeClone -> Retrieving user key.')

    let key = await Key.findOne({
      _id: keyId,
      authId: context.userId
    })

    if (isDefined(key)) {
      logger.debug('authorizeClone -> Key found.')

      if (!releaseClon) {
        if (isDefined(key.activeCloneId)) {
          key.activeCloneId = cloneId
          key.access_token = crypto.randomBytes(64).toString('hex')
        } else {
          throw new WrongArgumentsError('The key is in use.')
        }
      } else {
        key.activeCloneId = ''
        key.access_token = ''
      }
      await saveAuditLog(key.id, 'authorizeClone', context, cloneId)
      await key.save()

      logger.debug('authorizeClone -> Assigned clon updated on the key.')
      return key.access_token
    } else {
      throw new KeyVaultError('Key not found.')
    }
  } catch (error) {
    logger.error('authorizeClone -> Error assigning clon to key. %s', error.stack)
    throw new KeyVaultError('Error assigning clon to key. ' + error.message)
  }
}

const AuthorizeClone = {
  authorizeClone: {
    type: GraphQLString,
    args,
    resolve
  }
}

export default AuthorizeClone
