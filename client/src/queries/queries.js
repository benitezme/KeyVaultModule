import {gql} from 'apollo-boost';

const getExchangesQuery = gql`
  {
    exchanges{
      id
      name
      description
    }
  }
`

//TODO take the session authId
const getKeysQuery = gql`
  {
    keys(authId: "1") {
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
  mutation($authId: ID!, $key: String!, $secret: String!, $type: String!,
            $description: String!, $exchange: String!, $validFrom: String!,
            $validTo: String!, $botId: ID!){
    addKey(
      authId: $authId,
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

export {getExchangesQuery, getKeysQuery, addKeyMutation, getKeyQuery};
