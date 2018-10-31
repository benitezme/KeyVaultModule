import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString
} from 'graphql'

import {
  KeyType
} from './index'

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
        return parent.key
          // TODO Relocate business logic for resolve methods
        //return Key.findById({ _id: parent.keyId })
      }
    }
  })
})

export default AuditLogType
