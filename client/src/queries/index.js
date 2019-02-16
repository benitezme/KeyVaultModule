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
      description
      exchange
      validFrom
      validTo
      active
      defaultKey
      activeCloneId
    }
  }
`

const addKeyMutation = gql`
  mutation($key: String!, $secret: String!, $exchange: String!,
            $description: String, $validFrom: Int, $validTo: Int,
            $active: Boolean, $defaultKey: Boolean!, $acceptedTermsOfService: Boolean!){
    keyVault_AddKey(
      key: $key,
      secret: $secret,
      exchange: $exchange,
      description: $description,
      validFrom: $validFrom,
      validTo: $validTo,
      active: $active,
      defaultKey: $defaultKey,
      acceptedTermsOfService: $acceptedTermsOfService
    ){
      id
      key
    }
  }
`

const editKeyMutation = gql`
  mutation($id: ID!, $description: String!, $validFrom: Int!,
            $validTo: Int!, $active: Boolean!, $defaultKey: Boolean!){
    keyVault_EditKey(
      id: $id,
      description: $description,
      validFrom: $validFrom,
      validTo: $validTo,
      active: $active,
      defaultKey: $defaultKey
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

const removeKeyMutation = gql`
  mutation($id: ID!){
    keyVault_RemoveKey( id: $id)
  }
`

export { getSecret, getKeysQuery, addKeyMutation, editKeyMutation, getKeyQuery, getAuditLog, removeKeyMutation }
