
const MODULE_NAME = 'schema'

const graphql = require('graphql')
const _ = require('lodash')
const crypto = require('crypto')
const Key = require('../models/key')
const AuditLog = require('../models/auditLog')
const exchanges = require('../models/exchange')
const tokenDecoder = require('../auth/token-decoder')
const utils = require('../auth/utils')

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
      resolve (parent, args) {
        return AuditLog.find({})
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

              //TODO change password
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
        secret: {type: new GraphQLNonNull(GraphQLString)}, // TODO Encript
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
        botId: {type: new GraphQLNonNull(GraphQLID)}, // TODO validate botid
        transaction: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve (parent, args, context) {
        // TODO Relocate business logic for resolve methods
        let authIdOnSession = context.user.sub
        // Retrieve key
        return new Promise((resolve, reject) => {
          Key.findOne({$and: [
              {authId: authIdOnSession},
              {botId: args.botId}
          ]}).exec(function (err, key) {
            if (key) {
                  // Get exchange properties
              var exchange = _.find(exchanges, {description: key.exchange})

                  // Sign transaction
              var qsSignature = crypto.createHmac(exchange.algorithm, key.secret)
                        .update(args.transaction)
                        .digest('hex')

              saveAuditLog(key.id, 'signTransaction', context)

              var signedTransaction = {
                signature: qsSignature,
                date: new Date().valueOf()
              }

              resolve(signedTransaction)
            } else {
                  // TODO Pending error handling
              reject('Error: key not found.')
            }
          })
        })
      }
    },
    authenticate: {
      type: UserType,
      args: {
        idToken: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve (parent, args) {
        if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> Mutation -> authenticate -> resolve -> Entering function.') }

        /* In order to be able to wait for asyc calls to the database, and authorization authority, we need to return a promise to GraphQL. */

        const promiseToGraphQL = new Promise((resolve, reject) => {
          if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> Mutation -> authenticate -> resolve -> Promise -> Entering function.') }
          authenticate(args.idToken, onAuthenticated)

          function onAuthenticated (err, responseToGraphQL) {
            if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> Mutation -> authenticate -> resolve -> Promise -> onAuthenticated -> Entering function.') }
            if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> Mutation -> authenticate -> resolve -> Promise -> onAuthenticated -> responseToGraphQL = ' + JSON.stringify(responseToGraphQL)) }

            if (err.result !== global.DEFAULT_OK_RESPONSE.result) {
              if (global.ERROR_LOG === true) { console.log('[ERROR] ' + MODULE_NAME + ' -> Mutation -> authenticate -> resolve -> Promise -> onAuthenticated -> err.message = ' + err.message) }
              reject(responseToGraphQL)
            } else {
              resolve(responseToGraphQL)
            }
          }
        })

        return promiseToGraphQL
      }
    }
    // TODO pending authentication method
  }
})

function authenticate (encodedToken, callBackFunction) {
  try {
    if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> authenticate -> Entering function.') }

    let authId = ''
    let alias = ''
    let email = ''
    let emailVerified = false

    tokenDecoder(encodedToken, onValidated)

    function onValidated (err, decodedToken) {
      if (global.INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> authenticate -> onValidated -> Entering function.') }

      if (err.result !== global.DEFAULT_OK_RESPONSE.result) {
        if (global.ERROR_LOG === true) { console.log('[ERROR] ' + MODULE_NAME + ' -> authenticate -> onValidated -> err.message = ' + err.message) }
        callBackFunction(global.DEFAULT_FAIL_RESPONSE, { error: err })
        return
      }

      /*

      Ok, the user was correctly authenticated. Next we need to know if this logged in user
      has already been added to this module's database or not yet.

      */

      authId = decodedToken.sub
      alias = decodedToken.nickname
      email = decodedToken.email
      emailVerified = decodedToken.email_verified

      findUserByAuthId(authId, onUserFound)

      function onUserFound (err, user) {
        if (global.INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> authenticate -> onValidated -> onUserFound -> Entering function.') }

        if (err.result === global.DEFAULT_FAIL_RESPONSE.result) {
          if (global.ERROR_LOG === true) { console.log('[ERROR] ' + MODULE_NAME + ' -> authenticate -> onValidated -> onUserFound -> err.message = ' + err.message) }
          callBackFunction(global.DEFAULT_FAIL_RESPONSE, { error: err })
          return
        }

        if (err.result === global.DEFAULT_OK_RESPONSE.result) {
          if (global.INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> authenticate -> onValidated -> onUserFound -> User already exists at database') }

          if (global.INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> authenticate -> onValidated -> onUserFound -> Existing User: ' + JSON.stringify(user)) }

          /*

          Here we save the user id of the logged in user at the server Sessions map, from there it will
          be used to validate any further transaction comming from this same user.

          */

          callBackFunction(global.DEFAULT_OK_RESPONSE, { authId: authId, alias: user.alias })
          return
        }

        if (
          err.result === global.CUSTOM_OK_RESPONSE.result &&
          err.message === 'User Not Found'
        ) {
          if (global.INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> authenticate -> onValidated -> onUserFound -> User does not exist at database') }

          /*

          The authenticated user is NOT at our module database. We need to add him.
          We will take from the authentication provider the basic information it knows about the logged in users
          and save it as an initial set of data, which can later be modified.

          */

          /* The user can sign up with many different possible social accounts. Currently this module only supports Github only. */

          let authArray = authId.split('|')
          let socialAccountProvider = authArray[0]

          if (socialAccountProvider !== 'github') {
            if (global.ERROR_LOG === true) { console.log('[ERROR] ' + MODULE_NAME + ' -> authenticate -> onValidated -> onUserFound -> Social Account Provider not Supoorted. ') }
            if (global.ERROR_LOG === true) { console.log('[ERROR] ' + MODULE_NAME + ' -> authenticate -> onValidated -> onUserFound -> socialAccountProvider = ' + socialAccountProvider) }

            callBackFunction(global.DEFAULT_FAIL_RESPONSE, { error: err })
            return
          }

          let newUser = new User({
            alias: alias,
            authId: authId,
            email: email,
            emailVerified: emailVerified,
            roleId: '1'
          })

          if (global.INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> authenticate -> onValidated -> onUserFound -> ' + alias + ' needs to be added to the database') }

          callBackFunction(global.DEFAULT_OK_RESPONSE, { authId, alias })
        }
      }
    }
  } catch (err) {
    if (global.ERROR_LOG === true) { console.log('[ERROR] ' + MODULE_NAME + ' -> authenticate -> err.message = ' + err.message) }
    callBackFunction(global.DEFAULT_FAIL_RESPONSE, { error: err })
  }
}

// TODO Call Users Module, if it doesn't exist create it

function findUserByAuthId (authId, callBackFunction) {
  try {
    if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> findUserByAuthId -> Entering function.') }
    if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> findUserByAuthId -> authId = ' + authId) }

    if (authId === null || authId === undefined) {
      if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> findUserByAuthId -> User requested not specified.') }
      if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> findUserByAuthId -> args.authId = ' + authId) }

      callBackFunction(global.DEFAULT_FAIL_RESPONSE, { error: 'Bad Request' })
      return
    }

    // User.findOne({authId: authId}, onUserReceived)
    onUserReceived(undefined, {authId: authId})

    function onUserReceived (err, user) {
      if (err) {
        if (ERROR_LOG === true) { console.log('[ERROR] ' + MODULE_NAME + ' -> findUserByAuthId -> onUserReceived -> Database Error.') }
        if (ERROR_LOG === true) { console.log('[ERROR] ' + MODULE_NAME + ' -> findUserByAuthId -> onUserReceived -> err = ' + err) }
        callBackFunction(global.DEFAULT_FAIL_RESPONSE, { error: err })
      } else {
        if (user === null) {
          if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> findUserByAuthId -> onUserReceived -> User not found at Database.') }
          if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> findUserByAuthId -> onUserReceived -> args.authId = ' + authId) }

          let customResponse = {
            result: global.CUSTOM_OK_RESPONSE.result,
            message: 'User Not Found'
          }

          callBackFunction(customResponse, { error: customResponse.message })
          return
        }

        if (user.authId === authId && user.authId !== undefined) {
          if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> findUserByAuthId -> onUserReceived -> User found at Database.') }
          if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> findUserByAuthId -> onUserReceived -> args.authId = ' + authId) }

          callBackFunction(global.DEFAULT_OK_RESPONSE, user)
          return
        } else {
          if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> findUserByAuthId -> onUserReceived -> User found at Database is not the user requested.') }
          if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> findUserByAuthId -> onUserReceived -> args.authId = ' + authId) }
          if (INFO_LOG === true) { console.log('[INFO] ' + MODULE_NAME + ' -> findUserByAuthId -> onUserReceived -> user.authId = ' + user.authId) }

          callBackFunction(global.DEFAULT_FAIL_RESPONSE, { error: err })
          return
        }
      }
    }
  } catch (err) {
    if (global.ERROR_LOG === true) { console.log('[ERROR] ' + MODULE_NAME + ' -> findUserByAuthId -> err.message = ' + err.message) }
    callBackFunction(global.DEFAULT_FAIL_RESPONSE, { error: err })
  }
}

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
