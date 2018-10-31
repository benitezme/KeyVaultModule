import {
  GraphQLObjectType
} from 'graphql'

import AddKeyMutation from './AddKeyMutation'
import EditKeyMutation from './EditKeyMutation'
import RemoveKeyMutation from './RemoveKeyMutation'
import AssignKeyBotMutation from './AssignKeyBotMutation'
import SignTransactionMutation from './SignTransactionMutation'

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: Object.assign(
    AddKeyMutation,
    EditKeyMutation,
    RemoveKeyMutation,
    AssignKeyBotMutation,
    SignTransactionMutation
  )
})

export default Mutation
