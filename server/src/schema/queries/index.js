import {
  GraphQLObjectType
} from 'graphql'

import AuditLogsQuery from './AuditLogsQuery'
import ExchangesQuery from './ExchangesQuery'
import KeysQuery from './KeysQuery'
import SecretQuery from './SecretQuery'
import DefaultKey from './DefaultKey'
import AvailableKey from './AvailableKeys'

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: Object.assign(
    AuditLogsQuery,
    ExchangesQuery,
    KeysQuery,
    SecretQuery,
    DefaultKey,
    AvailableKey
  )
})

export default RootQuery
