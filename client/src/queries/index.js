import gql from 'graphql-tag'

const getExchangesQuery = gql`
  {
    exchanges{
      id
      name
      description
    }
  }
`

// TODO take the session authId
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
  mutation($key: String!, $secret: String!, $type: String!,
            $description: String!, $exchange: String!, $validFrom: String!,
            $validTo: String!, $botId: ID!){
    addKey(
      key: $key,
      secret: $secret,
      type: $type,
      description: $description,
      exchange: $exchange,
      validFrom: $validFrom,
      validTo: $validTo,
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

export { getExchangesQuery, getKeysQuery, addKeyMutation, getKeyQuery }
