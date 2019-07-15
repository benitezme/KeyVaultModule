import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'

import {
  WrongArgumentsError,
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
  transaction: { type: new GraphQLNonNull(GraphQLString) },
  keyId: { type: GraphQLString },
  cloneId: { type: GraphQLString }
}

const resolve = async (parent, { transaction, keyId, cloneId }, context) => {
  logger.debug('signTransaction -> Entering function.')

  try {
    if (context.keyvault === undefined || context.keyvault === null) {
      throw new WrongArgumentsError('signTransaction -> Access key not found.')
    }

    let key = await Key.findOne({
      _id: keyId,
      activeCloneId: cloneId
    })

    if (!isDefined(key)) {
      throw new WrongArgumentsError('signTransaction -> Key not found.')
    }

    if (key.access_token !== context.keyvault) {
      throw new WrongArgumentsError('signTransaction -> Wrong key not found.')
    }

    logger.debug('signTransaction -> Key found.')
    // Get exchange properties
    let exchange = _.find(Exchange, { name: key.exchange })

    const civ = crypto.randomBytes(16).toString('hex').slice(0, 16)
    let decipher = crypto.createDecipher('aes192', process.env.SERVER_SECRET, civ)
    let secret = decipher.update(key.secret, 'hex', 'utf8')
    secret += decipher.final('utf8')

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
