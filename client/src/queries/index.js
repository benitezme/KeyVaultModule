import gql from 'graphql-tag'

const getSecret = gql`
  query($id: ID!){
    secret(id: $id)
  }
`

const getKeysQuery = gql`
{
    keys{
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
    addKey(
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
    editKey(
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
    key(id: $id) {
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

const getUserByAuthId = gql`
query($authId: String){
    userByAuthId (authId: $authId){
      id
      alias
      firstName
      middleName
      lastName
      bio
      email
      emailVerified
      isDeveloper
      isDataAnalyst
      isTrader
      role {
        id
      }
    }
}
`

export { getSecret, getKeysQuery, addKeyMutation, editKeyMutation, getKeyQuery, getUserByAuthId }
