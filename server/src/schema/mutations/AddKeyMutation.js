import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

import {
  AuthentificationError,
  WrongArgumentsError
} from '../../errors'

import { KeyType } from '../types'
import { Key, Exchange, KeyMode } from '../../models'
import logger from '../../config/logger'
import saveAuditLog from './AddAuditLog'
import isUserAuthorized from './AuthorizeUser'
import crypto from 'crypto'

const args = {
  key: {type: new GraphQLNonNull(GraphQLString)},
  secret: {type: new GraphQLNonNull(GraphQLString)},
  exchange: {type: new GraphQLNonNull(GraphQLString)},
  type: {type: GraphQLString}, // TODO Tipify
  description: {type: GraphQLString},
  validFrom: {type: GraphQLInt},
  validTo: {type: GraphQLInt},
  active: {type: GraphQLBoolean},
  botId: {type: GraphQLID}
}

const resolve = (parent, { key, secret, exchange, type, description,
 validFrom, validTo, active, botId }, context) => {
  logger.debug('addKey -> Entering Fuction.')

  if (!context.userId) {
    throw new AuthentificationError()
  }

  if(!isUserAuthorized(context.authorization, botId)) {
    reject(new WrongArgumentsError('You are not eligible to assign this bot to the key, the bot is not yours!.'))
    return
  }

  if (!Exchange.some(exchange => exchange.name === exchange)) {
    reject(new WrongArgumentsError('The exchange selected is not valid.'))
    return
  }

  if (!KeyMode.some(keyMode => keyMode === type)) {
    reject(new WrongArgumentsError('The key mode type selected is not valid.'))
    return
  }

  logger.debug('addKey -> Adding new key.')

  const cipher = crypto.createCipher('aes192', process.env.SERVER_SECRET)
  let secretEncrypted = cipher.update(secret, 'utf8', 'hex')
  secretEncrypted += cipher.final('hex')

  let newKey = new Key({
    authId: context.userId,
    key: key,
    secret: secretEncrypted,
    exchange: exchange,
    type: type,
    description: description,
    validFrom: validFrom,
    validTo: validTo,
    active: active,
    botId: botId
  })

  newKey.id = newKey._id
  return new Promise((resolve, reject) => {
    newKey.save((err) => {
      if (err) reject(err)
      else {
        //TODO transaction on database
        saveAuditLog(newKey.id, 'addKey', context)
        resolve(newKey)
      }
    })
  })
}

const mutation = {
  addKey: {
    type: KeyType,
    args,
    resolve
  }
}

export default mutation
