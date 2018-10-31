import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'

import { SignedTransactionType } from '../types'
import { Key, Exchange } from '../../models'
import logger from '../../config/logger'
import saveAuditLog from './AddAuditLog'
import crypto from 'crypto'

const args = {
  botId: {type: GraphQLString},
  transaction: {type: new GraphQLNonNull(GraphQLString)}
}

const resolve = (parent, { botId, transaction }, context) => {
  logger.debug('signTransaction -> Entering function.')
  if(!context.userId){
    logger.error('signTransaction -> resolve -> Authentication Fail.')
    return 'Error: Authentication Fail.'
  } else {
    logger.debug('signTransaction -> Retrieve key started.')
    return new Promise((resolve, reject) => {
      Key.findOne({$and: [
          {botId: botId},
          {exchange: 1},
          {type: 'Competition'},
          {authId: context.userId}
        ]}).exec(function (err, key) {
          if (key) {
            logger.info('signTransaction -> Retrieve key -> Key found.')
            // Get exchange properties
            var exchange = _.find(Exchange, {id: key.exchange})

            const decipher = crypto.createDecipher('aes192', process.env.SERVER_SECRET);
            let secret = decipher.update(key.secret, 'hex', 'utf8');
            secret += decipher.final('utf8');

            // Sign transaction
            var qsSignature = crypto.createHmac(exchange.algorithm, secret)
                      .update(transaction)
                      .digest('hex')

            saveAuditLog(key.id, 'signTransaction', context, transaction)

            var signedTransaction = {
              key: key.key,
              signature: qsSignature,
              date: new Date().valueOf()
            }

            resolve(signedTransaction)
          } else {
            logger.error('signTransaction -> Retrieve key -> Key not found.')
            reject('Error: key not found.')
        }
      })
    })
  }

}

const mutation = {
  signTransaction: {
    type: SignedTransactionType,
    args,
    resolve
  }
}

export default mutation
