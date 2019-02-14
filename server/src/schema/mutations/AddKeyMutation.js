import {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

import {
  AuthentificationError,
  WrongArgumentsError,
  KeyVaultError
} from '../../errors'

import { KeyType } from '../types'
import { Key, Exchange } from '../../models'
import logger from '../../config/logger'
import saveAuditLog from './AddAuditLog'
import crypto from 'crypto'
import { isDefined } from '../../utils'

const args = {
  key: {type: new GraphQLNonNull(GraphQLString)},
  secret: {type: new GraphQLNonNull(GraphQLString)},
  exchange: {type: new GraphQLNonNull(GraphQLString)},
  description: {type: GraphQLString},
  validFrom: {type: GraphQLInt},
  validTo: {type: GraphQLInt},
  active: {type: GraphQLBoolean},
  defaultKey: {type: new GraphQLNonNull(GraphQLBoolean)}
}

const resolve = async (parent, { key, secret, exchange, description,
                  validFrom, validTo, active, defaultKey }, context) => {
  logger.debug('addKey -> Entering Fuction.')

  if (!context.userId) {
    throw new AuthentificationError()
  }

  if (!Exchange.some(e => e.id === exchange)) {
    throw new WrongArgumentsError('The exchange selected is not valid.')
  }

  try {
    const cipher = crypto.createCipher('aes192', process.env.SERVER_SECRET)
    let secretEncrypted = cipher.update(secret, 'utf8', 'hex')
    secretEncrypted += cipher.final('hex')

    if(defaultKey){
      logger.debug('addKey -> Default Key Changed.')
      let currentDefaultKey = await Key.findOne( {
        authId: context.userId,
        defaultKey: true
      })

      if(isDefined(currentDefaultKey)){
        logger.debug('addKey -> Changing old default key.')
        currentDefaultKey.defaultKey = false
        await currentDefaultKey.save()
      }
    }

    logger.debug('addKey -> Creating new key.')
    let newKey = new Key({
      authId: context.userId,
      key: key,
      exchange: exchange,
      secret: secretEncrypted,
      description: description,
      validFrom: validFrom,
      validTo: validTo,
      active: active,
      defaultKey: defaultKey,
      activeCloneId: ''
    })

    await newKey.save()
    newKey.id = newKey._id

    await saveAuditLog(newKey.id, 'addKey', context)

    logger.debug('addKey -> Creating new key sucessful.')
    return newKey
  } catch (error) {
    logger.error('addKey -> Error creating new key. %s', error.stack)
    throw new KeyVaultError('Error creating new key. ' + error.message)
  }
}

const AddKeyMutation = {
  addKey: {
    type: KeyType,
    args,
    resolve
  }
}

export default AddKeyMutation
