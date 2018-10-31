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
    type: {type: GraphQLString},
    description: {type: GraphQLString},
    exchange: {type: GraphQLString},
    validFrom: {type: GraphQLInt},
    validTo: {type: GraphQLInt},
    active: {type: GraphQLBoolean},
    botId: {type: GraphQLString}
  })
})
export default KeyType
