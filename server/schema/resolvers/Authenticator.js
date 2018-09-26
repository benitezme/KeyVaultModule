const appRoot = require('app-root-path')
const logger = require(`${appRoot}/server/config/logger`)
const tokenDecoder = require(`${appRoot}/server/auth/token-decoder`)

class Authenticator {

  resolve(parent, args){
    var self = this
    /* In order to be able to wait for asyc calls to the database, and authorization authority, we need to return a promise to GraphQL. */
    const promiseToGraphQL = new Promise((resolve, reject) => {
      logger.debug('resolve -> Promise -> Entering function.')
      self.authenticate(args.idToken, onAuthenticated)

      function onAuthenticated (err, responseToGraphQL) {
        logger.debug('resolve -> Promise -> onAuthenticated -> Entering function.')
        logger.debug('resolve -> Promise -> onAuthenticated -> responseToGraphQL = ' + JSON.stringify(responseToGraphQL))

        if (err.result !== global.DEFAULT_OK_RESPONSE.result) {
          logger.error('resolve -> Promise -> onAuthenticated -> err.message = ' + err.message)
          reject(responseToGraphQL)
        } else {
          resolve(responseToGraphQL)
        }
      }
    })

    return promiseToGraphQL
  }

  authenticate (encodedToken, callBackFunction) {
    try {
      logger.info('authenticate -> Entering function.')

      let authId = ''
      let alias = ''
      let email = ''
      let emailVerified = false
      var self = this
      tokenDecoder(encodedToken, onValidated)

      function onValidated (err, decodedToken) {
        logger.debug('authenticate -> onValidated -> Entering function.')

        if (err.result !== global.DEFAULT_OK_RESPONSE.result) {
          logger.error('authenticate -> onValidated -> err.message = ' + err.message)
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

        self.findUserByAuthId(authId, onUserFound)

        function onUserFound (err, user) {
          logger.debug(' authenticate -> onValidated -> onUserFound -> Entering function.')

          if (err.result === global.DEFAULT_FAIL_RESPONSE.result) {
            logger.error('authenticate -> onValidated -> onUserFound -> err.message = ' + err.message)
            callBackFunction(global.DEFAULT_FAIL_RESPONSE, { error: err })
            return
          }

          if (err.result === global.DEFAULT_OK_RESPONSE.result) {
            logger.debug(' authenticate -> onValidated -> onUserFound -> User already exists at database')
            logger.debug(' authenticate -> onValidated -> onUserFound -> Existing User: ' + JSON.stringify(user))

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
            logger.debug(' authenticate -> onValidated -> onUserFound -> User does not exist at database')

            /*

            The authenticated user is NOT at our module database. We need to add him.
            We will take from the authentication provider the basic information it knows about the logged in users
            and save it as an initial set of data, which can later be modified.

            */

            /* The user can sign up with many different possible social accounts. Currently this module only supports Github only. */

            let authArray = authId.split('|')
            let socialAccountProvider = authArray[0]

            if (socialAccountProvider !== 'github') {
              logger.error('authenticate -> onValidated -> onUserFound -> Social Account Provider not Supoorted. ')
              logger.error('authenticate -> onValidated -> onUserFound -> socialAccountProvider = ' + socialAccountProvider)

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

            logger.debug(' authenticate -> onValidated -> onUserFound -> ' + alias + ' needs to be added to the database')

            callBackFunction(global.DEFAULT_OK_RESPONSE, { authId, alias })
          }
        }
      }
    } catch (err) {
      logger.error('authenticate -> err.message = ' + err.message)
      callBackFunction(global.DEFAULT_FAIL_RESPONSE, { error: err })
    }
  }

  // TODO Call Users Module, if it doesn't exist create it
  findUserByAuthId (authId, callBackFunction) {
    try {
      logger.info('findUserByAuthId -> Entering function.')
      logger.debug('findUserByAuthId -> authId = ' + authId)

      if (authId === null || authId === undefined) {
        logger.debug('findUserByAuthId -> User requested not specified.')
        logger.debug('findUserByAuthId -> args.authId = ' + authId)

        callBackFunction(global.DEFAULT_FAIL_RESPONSE, { error: 'Bad Request' })
        return
      }

      // User.findOne({authId: authId}, onUserReceived)
      onUserReceived(undefined, {authId: authId})

      function onUserReceived (err, user) {
        if (err) {
          logger.error('findUserByAuthId -> onUserReceived -> Database Error.')
          logger.error('findUserByAuthId -> onUserReceived -> err = ' + err)
          callBackFunction(global.DEFAULT_FAIL_RESPONSE, { error: err })
        } else {
          if (user === null) {
            logger.debug('findUserByAuthId -> onUserReceived -> User not found at Database.')
            logger.debug('findUserByAuthId -> onUserReceived -> args.authId = ' + authId)

            let customResponse = {
              result: global.CUSTOM_OK_RESPONSE.result,
              message: 'User Not Found'
            }

            callBackFunction(customResponse, { error: customResponse.message })
            return
          }

          if (user.authId === authId && user.authId !== undefined) {
            logger.debug('findUserByAuthId -> onUserReceived -> User found at Database.')
            logger.debug('findUserByAuthId -> onUserReceived -> args.authId = ' + authId)

            callBackFunction(global.DEFAULT_OK_RESPONSE, user)
            return
          } else {
            logger.debug('findUserByAuthId -> onUserReceived -> User found at Database is not the user requested.')
            logger.debug('findUserByAuthId -> onUserReceived -> args.authId = ' + authId)
            logger.debug('findUserByAuthId -> onUserReceived -> user.authId = ' + user.authId)

            callBackFunction(global.DEFAULT_FAIL_RESPONSE, { error: err })
            return
          }
        }
      }

    } catch (err) {
      logger.error('findUserByAuthId -> err.message = ' + err.message)
      callBackFunction(global.DEFAULT_FAIL_RESPONSE, { error: err })
    }
  }
}

module.exports = new Authenticator()
