const graphql = require('graphql');
const _ = require('lodash');
const crypto = require('crypto');
const Key = require('../models/key');
const AuditLog = require('../models/auditLog');
const exchanges = require('../models/exchange');

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList
} = graphql;

function saveAuditLog(keyId, action, details ){
  var auditLogEntry = new AuditLog({
    authId: '1', //TODO get the user id from the session
    keyId: keyId,
    action: action,
    details: details,
    date: new Date().valueOf() //TODO create UTC date
  });
  auditLogEntry.save(); //TODO Error management
}

const SignedTransactionType = new GraphQLObjectType({
  name: 'SignedTransaction',
  fields: () => ({
    signature: {type: GraphQLString},
    date: {type: GraphQLString}
  })
});

const ExchangeType = new GraphQLObjectType({
  name: 'Exchange',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    description: {type: GraphQLString}
  })
});

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
    botId: {type: GraphQLString} //TODO create the connection to another module
  })
});

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
        resolve(parent, args){
          //TODO Relocate business logic for resolve methods
          return Key.findById({ _id: parent.keyId });
        }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name:'RootQueryType',
  fields: {
    key: {
      type: KeyType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args){
        console.log(args.id)
        if(args.id)
          return Key.findById({_id: args.id});
      }
    },
    keys: {
      type: new GraphQLList(KeyType),
      args: {authId: {type: GraphQLID}},
      resolve(parent, args){
        return Key.find({authId: args.authId});
      }
    },
    auditLogs: {
      type: new GraphQLList(AuditLogType),
      resolve(parent, args){
        return AuditLog.find({});
      }
    },
    exchanges: {
      type: new GraphQLList(ExchangeType),
      resolve(parent, args){
        return exchanges;
      }
    },
  }
});

const Mutation = new GraphQLObjectType({
  name:'Mutation',
  fields: {
    addKey:{
      type: KeyType,
      args: {
        authId: {type: new GraphQLNonNull(GraphQLID)},
        key: {type: new GraphQLNonNull(GraphQLString)},
        secret: {type: new GraphQLNonNull(GraphQLString)}, //TODO Encript
        type: {type: new GraphQLNonNull(GraphQLString)}, //TODO Tipify
        description: {type: GraphQLString},
        exchange: {type: new GraphQLNonNull(GraphQLString)},
        validFrom: {type: new GraphQLNonNull(GraphQLString)},
        validTo: {type: new GraphQLNonNull(GraphQLString)},
        botId: {type: GraphQLID}
      },
      resolve (parent,args){
        //TODO Relocate business logic for resolve methods
        let newKey = new Key({
          authId: args.authId, //TODO the user only can create it's own keys
          key: args.key,
          secret: args.secret,
          type: args.type,
          description: args.description,
          exchange: args.exchange,
          validFrom: args.validFrom,
          validTo: args.validTo,
          active: true,
          botId: args.botId
        });

        newKey.id = newKey._id;
        return new Promise((resolve, reject) => {
          newKey.save((err) => {
            if(err) reject(err);
            else{
              saveAuditLog(newKey.id, 'addKey');
              resolve(newKey);
            }
          })
        })
      }
    },
    deactivateKey:{
      type: KeyType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        rason: {type: GraphQLString}
      },
      resolve (parent,args){
        //TODO Relocate business logic for resolve methods
        var query = {_id:args.id};
        var update = { active: false};
        var options = { new: true};

        saveAuditLog(args.id, 'deactivateKey');

        return Key.findOneAndUpdate(query, update, options);  //TODO check return value
      }
    },
    assignKeyBot:{
      type: GraphQLString,
      args: {
        key: {type: new GraphQLNonNull(GraphQLString)},
        botId: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve (parent,args){
        //TODO Relocate business logic for resolve methods
        return new Promise((resolve, reject) => {
          var query = {key: args.key};
          var update = { botId: args.botId};
          Key.updateOne(query, update).exec(function(err, key){
                if (key) {
                  saveAuditLog(key.id, 'assignKeyBot');
                  resolve('Sucessfully assigned key to bot: '+ args.botId);
                }
                else {
                  //TODO Pending error handling
                  reject("Error: key or botId not found.");
                }
            });
        });

      }
    },
    signTransaction:{
      type: SignedTransactionType,
      args: {
        authId: {type: new GraphQLNonNull(GraphQLID)}, //TODO Get from the session
        botId: {type: new GraphQLNonNull(GraphQLID)}, //TODO validate botid
        transaction: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve (parent,args){
        //TODO Relocate business logic for resolve methods
        //Retrieve key
        return new Promise((resolve, reject) => {
          Key.findOne({$and: [
              {authId: args.authId},
              {botId: args.botId}
          ]}).exec(function(err, key){
                if (key) {
                  //Get exchange properties
                  var exchange = _.find(exchanges,{description: key.exchange});

                  //Sign transaction
                  var qsSignature = crypto.createHmac(exchange.algorithm, key.secret)
                        .update(args.transaction)
                        .digest('hex');

                  saveAuditLog(key.id, 'signTransaction');

                  var signedTransaction = {
                    signature: qsSignature,
                    date: new Date().valueOf()
                  };

                  resolve(signedTransaction);
                }
                else {
                  //TODO Pending error handling
                  reject( "Error: key not found.");
                }
            });
        });

      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
