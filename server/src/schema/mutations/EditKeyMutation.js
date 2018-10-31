import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

import { KeyType } from '../types'
import { Key } from '../../models'
import logger from '../../config/logger'
import saveAuditLog from './AddAuditLog'

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
