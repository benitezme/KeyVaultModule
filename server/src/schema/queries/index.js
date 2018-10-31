import {
  GraphQLObjectType
} from 'graphql'

import AuditLogsQuery from './AuditLogsQuery'
import ExchangesQuery from './ExchangesQuery'
import KeysQuery from './KeysQuery'
import SecretQuery from './SecretQuery'

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: Object.assign(
    AuditLogsQuery,
    ExchangesQuery,
    KeysQuery,
    SecretQuery
  )
})

export default RootQuery
