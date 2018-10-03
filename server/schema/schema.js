const graphql = require('graphql')
const _ = require('lodash')
const crypto = require('crypto')
const Key = require('../models/key')
const AuditLog = require('../models/auditLog')
const exchanges = require('../models/exchange')
const utils = require('../auth/utils')

const authenticator = require('./resolvers/Authenticator')
const logger = require('../config/logger')

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList
} = graphql

function saveAuditLog (keyId, action, context, details) {
  let authIdOnSession = context.user.sub
  let localDate = new Date()
  let date = new Date(Date.UTC(
    localDate.getUTCFullYear(),
    localDate.getUTCMonth(),
    localDate.getUTCDate(),
    localDate.getUTCHours(),
    localDate.getUTCMinutes(),
    localDate.getUTCSeconds(),
    localDate.getUTCMilliseconds())
  )

  var auditLogEntry = new AuditLog({
    authId: authIdOnSession,
    keyId: keyId,
    action: action,
    details: details,
    date: date.toISOString()
  })

  logger.info('saveAuditLog -> Saving a new Audit Log Record.')
  auditLogEntry.save() // TODO Error management
}

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID},
    authId: { type: GraphQLString},
    alias: {type: GraphQLString},
    firstName: {type: GraphQLString},
    middleName: {type: GraphQLString},
    lastName: {type: GraphQLString},
    email: {type: GraphQLString},
    emailVerified: {type: GraphQLInt},
    isDeveloper: {type: GraphQLInt},
    isTrader: {type: GraphQLInt},
    isDataAnalyst: {type: GraphQLInt}
  })
})

const SignedTransactionType = new GraphQLObjectType({
  name: 'SignedTransaction',
  fields: () => ({
    key: {type: GraphQLString},
    signature: {type: GraphQLString},
    date: {type: GraphQLString}
  })
})

const ExchangeType = new GraphQLObjectType({
  name: 'Exchange',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    description: {type: GraphQLString}
  })
})

const KeyType = new GraphQLObjectType({
  name: 'Key',
  fields: () => ({
    id: {type: GraphQLID},
    authId: {type: GraphQLID},
    key: {type: GraphQLString},
    type: {type: GraphQLString},
    description: {type: GraphQLString},
    exchange: {type: GraphQLString},
    validFrom: {type: GraphQLString},
    validTo: {type: GraphQLString},
    active: {type: GraphQLBoolean},
    botId: {type: GraphQLString} // TODO create the connection to another module
  })
})

const AuditLogType = new GraphQLObjectType({
  name: 'AuditLog',
  fields: () => ({
    id: {type: GraphQLID},
    authId: {type: GraphQLID},
    action: {type: GraphQLString},
    details: {type: GraphQLString},
    date: {type: GraphQLString},
    key: {
      type: KeyType,
      resolve (parent, args) {
          // TODO Relocate business logic for resolve methods
        return Key.findById({ _id: parent.keyId })
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    keys: {
      type: new GraphQLList(KeyType),
      resolve (parent, args, context) {
        let authIdOnSession = context.user.sub // TODO can this be changed?
        return Key.find({authId: authIdOnSession})
      }
    },
    auditLogs: {
      type: new GraphQLList(AuditLogType),
      args: {
        key: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve (parent, args, context) {
        let authIdOnSession = context.user.sub
        return AuditLog.find({
          authId: authIdOnSession,
          keyId: args.key
        })
      }
    },
    exchanges: {
      type: new GraphQLList(ExchangeType),
      resolve (parent, args) {
        return exchanges
      }
    },
    secret: {
      type: GraphQLString,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve (parent, args, context) {
        let authIdOnSession = context.user.sub
        return new Promise((resolve, reject) => {
          Key.findOne({$and: [
              {_id: args.id},
              {authId: authIdOnSession},
          ]}, (err, key) => {
            if (err || key === null) reject(err)
            else {

              saveAuditLog(key.id, 'secretRequested', context)

              const decipher = crypto.createDecipher('aes192', utils.serverSecret);
              let decrypted = decipher.update(key.secret, 'hex', 'utf8');
              decrypted += decipher.final('utf8');

              resolve(decrypted)
            }
          })
        })
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addKey: {
      type: KeyType,
      args: {
        key: {type: new GraphQLNonNull(GraphQLString)},
        secret: {type: new GraphQLNonNull(GraphQLString)},
        exchange: {type: new GraphQLNonNull(GraphQLString)},
        type: {type: GraphQLString}, // TODO Tipify
        description: {type: GraphQLString},
        validFrom: {type: GraphQLString},
        validTo: {type: GraphQLString},
        active: {type: GraphQLBoolean},
        botId: {type: GraphQLID}
      },
      resolve (parent, args, context) {
        // TODO Relocate business logic for resolve methods
        let authIdOnSession = context.user.sub

        //TODO change password
        const cipher = crypto.createCipher('aes192', utils.serverSecret)
        let secret = cipher.update(args.secret, 'utf8', 'hex')
        secret += cipher.final('hex')

        let newKey = new Key({
          authId: authIdOnSession,
          key: args.key,
          secret: secret,
          exchange: args.exchange,
          type: args.type,
          description: args.description,
          validFrom: args.validFrom,
          validTo: args.validTo,
          active: args.active,
          botId: args.botId
        })

        // TODO Validate key, secret and exchange are not empty
        newKey.id = newKey._id
        return new Promise((resolve, reject) => {
          newKey.save((err) => {
            if (err) reject(err)
            else {
              saveAuditLog(newKey.id, 'addKey', context)
              resolve(newKey)
            }
          })
        })
      }
    },
    editKey: {
      type: KeyType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        type: {type: GraphQLString}, // TODO Tipify
        description: {type: GraphQLString},
        validFrom: {type: GraphQLString},
        validTo: {type: GraphQLString},
        active: {type: GraphQLBoolean},
        botId: {type: GraphQLID}
      },
      resolve (parent, args, context) {
        // TODO Relocate business logic for resolve methods
        let authIdOnSession = context.user.sub
        var query = {_id: args.id}
        var options = { new: true}
        let update = {
          type: args.type,
          description: args.description,
          validFrom: args.validFrom,
          validTo: args.validTo,
          active: args.active,
          botId: args.botId
        }

        saveAuditLog(args.id, 'editKey', context)

        return Key.findOneAndUpdate(query, update, options)  // TODO check return value
      }
    },
    assignKeyBot: {
      type: GraphQLString,
      args: {
        key: {type: new GraphQLNonNull(GraphQLString)},
        botId: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve (parent, args) {
        // TODO Relocate business logic for resolve methods
        return new Promise((resolve, reject) => {
          var query = {key: args.key}
          var update = { botId: args.botId}
          Key.updateOne(query, update).exec(function (err, key) {
            if (key) {
              saveAuditLog(key.id, 'assignKeyBot', context)
              resolve('Sucessfully assigned key to bot: ' + args.botId)
            } else {
              // TODO Pending error handling
              reject('Error: key or botId not found.')
            }
          })
        })
      }
    },
    signTransaction: {
      type: SignedTransactionType,
      args: {
        botId: {type: GraphQLString}, // TODO validate botid
        transaction: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve (parent, args, context) {
        // TODO Relocate business logic for resolve methods
        logger.info('signTransaction -> resolve -> Entering function.')
        if(!context){
          logger.error('signTransaction -> resolve -> Authentication Fail.')
          return 'Error: Authentication Fail.'
        } else if(context.user.sub !== utils.exchangeModuleId){
          logger.error('signTransaction -> resolve -> User not found: ' + context.user.sub)
            return 'Error: User not found.'
        } else {
          logger.info('signTransaction -> resolve -> Retrieve key started.')
          return new Promise((resolve, reject) => {
            Key.findOne({$and: [
                {botId: args.botId},
                {exchange: 1},
                {type: 'Competition'}
                // {botId: args.botId}
              ]}).exec(function (err, key) {
                if (key) {
                  logger.info('signTransaction -> resolve -> Retrieve key -> Key found.')
                  // Get exchange properties
                  var exchange = _.find(exchanges, {id: key.exchange})

                  const decipher = crypto.createDecipher('aes192', utils.serverSecret);
                  let secret = decipher.update(key.secret, 'hex', 'utf8');
                  secret += decipher.final('utf8');

                  // Sign transaction
                  var qsSignature = crypto.createHmac(exchange.algorithm, secret)
                            .update(args.transaction)
                            .digest('hex')

                  saveAuditLog(key.id, 'signTransaction', context, args.transaction)

                  var signedTransaction = {
                    key: key.key,
                    signature: qsSignature,
                    date: new Date().valueOf()
                  }

                  resolve(signedTransaction)
                } else {
                  logger.info('signTransaction -> resolve -> Retrieve key -> Key not found.')
                  reject('Error: key not found.')
              }
            })
          })
        }
      }
    },
    authenticate: {
      type: UserType,
      args: {
        idToken: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve (parent, args) {
        logger.info('authenticate -> resolve -> Entering function.')
        return authenticator.resolve(parent, args)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
