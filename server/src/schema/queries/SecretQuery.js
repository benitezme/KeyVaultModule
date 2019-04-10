import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString
} from 'graphql'

import {
  AuthentificationError
} from '../../errors'

import { Key } from '../../models'
import logger from '../../config/logger'
import saveAuditLog from '../mutations/AddAuditLog'
import crypto from 'crypto'

const args = {
  id: { type: new GraphQLNonNull(GraphQLID) }
}

const resolve = (parent, { id }, context) => {
  logger.debug('secret -> Entering Fuction.')

  if (!context.userId) {
    throw new AuthentificationError()
  }

  return new Promise((resolve, reject) => {
    Key.findOne({$and: [
        {_id: id},
        {authId: context.userId}
    ]}, (err, key) => {
      if (err || key === null) reject(err)
      else {

        saveAuditLog(key.id, 'secretRequested', context)

        const civ = crypto.randomBytes(16).toString('hex').slice(0, 16)
        const decipher = crypto.createDecipher('aes192', process.env.SERVER_SECRET, civ);
        let decrypted = decipher.update(key.secret, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        resolve(decrypted)
      }
    })
  })
}

const SecretQuery = {
  secret: {
    type: GraphQLString,
    args,
    resolve
  }
}

export default SecretQuery
