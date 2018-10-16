import gql from 'graphql-tag'

const getSecret = gql`
  query($id: ID!){
    keyVault_Secret(id: $id)
  }
`

const getKeysQuery = gql`
{
    keyVault_Keys{
      id
      authId
      key
      type
      description
      exchange
      validFrom
      validTo
      active
      botId
    }
  }
`

const addKeyMutation = gql`
  mutation($key: String!, $secret: String!, $exchange: String!,
            $type: String!, $description: String!, $validFrom: String!,
            $validTo: String!, $active: Boolean!, $botId: ID!){
    keyVault_AddKey(
      key: $key,
      secret: $secret,
      exchange: $exchange,
      type: $type,
      description: $description,
      validFrom: $validFrom,
      validTo: $validTo,
      active: $active,
      botId: $botId
    ){
      id
      key
    }
  }
`

const editKeyMutation = gql`
  mutation($id: ID!, $type: String!, $description: String!, $validFrom: String!,
            $validTo: String!, $active: Boolean!, $botId: ID!){
    keyVault_EditKey(
      id: $id,
      type: $type,
      description: $description,
      validFrom: $validFrom,
      validTo: $validTo,
      active: $active,
      botId: $botId
    ){
      id
      key
    }
  }
`

const getKeyQuery = gql`
  query($id: ID!){
    keyVault_Key(id: $id) {
      id
      authId
      key
      type
      description
      exchange
      validFrom
      validTo
      active
      botId
    }
  }
`

const getAuditLog = gql`
  query($key: String!){
    keyVault_AuditLogs(key: $key){
      id,
      date,
      action,
      details
    }
  }
`
const getBotsQuery = gql`
  query{
    teams_FbByTeamMember{
      name
      fb{
        name
      }
    }
  }
`

const removeKeyMutation = gql`
  mutation($id: ID!){
    keyVault_RemoveKey( id: $id)
  }
`

export { getSecret, getKeysQuery, addKeyMutation, editKeyMutation, getKeyQuery, getAuditLog, removeKeyMutation, getBotsQuery }
