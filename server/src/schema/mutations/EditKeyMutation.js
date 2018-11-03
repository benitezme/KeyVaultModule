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
import { Key, KeyMode } from '../../models'
import logger from '../../config/logger'
import saveAuditLog from './AddAuditLog'
import isUserAuthorized from './AuthorizeUser'

const args = {
  id: {type: new GraphQLNonNull(GraphQLID)},
  type: {type: GraphQLString}, // TODO Tipify
  description: {type: GraphQLString},
  validFrom: {type: GraphQLInt},
  validTo: {type: GraphQLInt},
  active: {type: GraphQLBoolean},
  botId: {type: GraphQLID}
}

const resolve = (parent, { id, type, description, validFrom, validTo, active,
  botId }, context) => {
  logger.debug('editKey -> Entering Fuction.')

  if (!context.userId) {
    throw new AuthentificationError()
  }

  if(!isUserAuthorized(context.authorization, botId)) {
    reject(new WrongArgumentsError('You are not eligible to assign this bot to the key, the bot is not yours!.'))
    return
  }

  if (!KeyMode.some(keyMode => keyMode === type)) {
    reject(new WrongArgumentsError('The key mode type selected is not valid.'))
    return
  }

  logger.debug('editKey -> Editing key.')

  var query = {
    _id: id,
    authId: context.userId
  }
  var options = { new: true}
  let update = {
    type: type,
    description: description,
    validFrom: validFrom,
    validTo: validTo,
    active: active,
    botId: botId
  }

  saveAuditLog(id, 'editKey', context)

  return Key.findOneAndUpdate(query, update, options)

}

const mutation = {
  editKey: {
    type: KeyType,
    args,
    resolve
  }
}

export default mutation
