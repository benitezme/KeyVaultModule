import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLString
} from 'graphql'

import {
  AuthentificationError
} from '../../errors'

import { Key } from '../../models'
import logger from '../../config/logger'
import saveAuditLog from './AddAuditLog'

const args = {
  key: {type: new GraphQLNonNull(GraphQLString)},
  botId: {type: new GraphQLNonNull(GraphQLID)}
}

const resolve = (parent, { key, botId }, context) => {
  logger.debug('assignKeyBot -> Entering Fuction.')

  if (!context.userId) {
    throw new AuthentificationError()
  }

  return new Promise((resolve, reject) => {
    var query = {
      key: key,
      authId: context.userId
    }
    var update = { botId: botId}
    Key.updateOne(query, update).exec(function (err, key) {
      if (key) {
        saveAuditLog(key.id, 'assignKeyBot', context)
        resolve('Sucessfully assigned key to bot: ' + botId)
      } else {
        reject('Error: key or botId not found.')
      }
    })
  })

}

const mutation = {
  assignKeyBot: {
    type: GraphQLString,
    args,
    resolve
  }
}

export default mutation
