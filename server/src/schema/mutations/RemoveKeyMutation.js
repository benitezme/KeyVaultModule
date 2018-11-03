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

const resolve = (parent, { id }, context) => {
  logger.debug('removeKey -> Entering Fuction.')

  if (!context.userId) {
    throw new AuthentificationError()
  }

  logger.debug('removeKey -> Removing key.')

  var query = {
    _id: id,
    authId: context.userId
  }

  saveAuditLog(id, 'removeKey', context)

  Key.deleteOne(query, function (err) {
    if (err){
      throw new KeyVaultError('Error removing key', err)
    }else{
      return 'Key Removed'
    }
  })
}

const mutation = {
  removeKey: {
    type: GraphQLString,
    args,
    resolve
  }
}

export default mutation
