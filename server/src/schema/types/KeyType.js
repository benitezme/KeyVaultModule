import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLID
} from 'graphql'

const KeyType = new GraphQLObjectType({
  name: 'Key',
  fields: () => ({
    id: {type: GraphQLID},
    authId: {type: GraphQLID},
    key: {type: GraphQLString},
    description: {type: GraphQLString},
    exchange: {type: GraphQLString},
    validFrom: {type: GraphQLInt},
    validTo: {type: GraphQLInt},
    active: {type: GraphQLBoolean},
    defaultKey: {type: GraphQLBoolean},
    activeCloneId: {type: GraphQLString}
  })
})
export default KeyType
