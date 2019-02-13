import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'

import {
  AuthentificationError,
  KeyVaultError
} from '../../errors'

import { SignedTransactionType } from '../types'
import { Key, Exchange } from '../../models'
import logger from '../../config/logger'
import saveAuditLog from './AddAuditLog'
import { isDefined } from '../../utils'
import crypto from 'crypto'
import _ from 'lodash'

const args = {
  keyId: {type: new GraphQLNonNull(GraphQLString)},
  cloneId: {type: new GraphQLNonNull(GraphQLString)},
  transaction: {type: new GraphQLNonNull(GraphQLString)}
}

const resolve = async (parent, { keyId, cloneId, transaction }, context) => {
  logger.debug('signTransaction -> Entering function.')

  if (!context.userId) {
    throw new AuthentificationError()
  }

  try {
    logger.debug('signTransaction -> Retrieving key.')

    let key = await Key.findOne({
        _id: keyId,
        activeCloneId: cloneId
      })

    if (isDefined(key)) {
      logger.debug('signTransaction -> Key found.')
      // Get exchange properties
      let exchange = _.find(Exchange, {id: key.exchange})

      let decipher = crypto.createDecipher('aes192', process.env.SERVER_SECRET);
      let secret = decipher.update(key.secret, 'hex', 'utf8');
      secret += decipher.final('utf8');

      // Sign transaction
      let qsSignature = crypto.createHmac(exchange.algorithm, secret)
                .update(transaction)
                .digest('hex')

      await saveAuditLog(key.id, 'signTransaction', context, transaction)

      let signedTransaction = {
        key: key.key,
        signature: qsSignature,
        date: new Date().valueOf()
      }

      return signedTransaction
    } else {
      throw new KeyVaultError('Key not found.')
    }
  } catch (error) {
    logger.error('signTransaction -> Error signing transaction. %s', error.stack)
    throw new KeyVaultError('Error signing transaction. ' + error.message)
  }
}

const SignTransactionMutation = {
  signTransaction: {
    type: SignedTransactionType,
    args,
    resolve
  }
}

export default SignTransactionMutation
