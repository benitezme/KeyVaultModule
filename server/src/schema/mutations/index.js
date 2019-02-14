import {
  GraphQLObjectType
} from 'graphql'

import AddKeyMutation from './AddKeyMutation'
import EditKeyMutation from './EditKeyMutation'
import RemoveKeyMutation from './RemoveKeyMutation'
import SignTransactionMutation from './SignTransactionMutation'
import AuthorizeClone from './AuthorizeClone'

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: Object.assign(
    AddKeyMutation,
    EditKeyMutation,
    RemoveKeyMutation,
    SignTransactionMutation,
    AuthorizeClone
  )
})

export default Mutation
