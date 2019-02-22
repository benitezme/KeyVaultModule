import axios from 'axios'
import logger from '../config/logger'
import { isDefined } from '../utils'

const isUserAuthorized = async (authorization, cloneId, authId) => {
  logger.debug('isUserAuthorized -> Checking authorization.')

  logger.debug('isUserAuthorized -> Getting clone information.')

  let operationsQuery = await axios({
    url: process.env.GATEWAY_ENDPOINT,
    method: 'post',
    data: {
      query: `
      query operations_GetClone($cloneId: ID!){
        operations_GetClone(
          cloneId: $cloneId
        ){
          id
          teamId
          botId
        }
      }
      `,
      variables: {
         cloneId: cloneId
       }
    },
    headers: {
      authorization: authorization,
    },
  })

  logger.debug('isUserAuthorized -> Clone obtained: %j: ',operationsQuery.data.data.operations_GetClone)
  let teamId
  if(isDefined(operationsQuery.data.data.operations_GetClone)){
    teamId = operationsQuery.data.data.operations_GetClone.teamId
  } else {
    logger.debug('isUserAuthorized -> User is not authorized.')
    return false
  }

  logger.debug('isUserAuthorized -> Getting team information.')
  let teamsQuery = await axios({
    url: process.env.GATEWAY_ENDPOINT,
    method: 'post',
    data: {
      query: `
        query teams_TeamById($teamId: String!){
          teams_TeamById(teamId:$teamId){
            members {
              member {
                alias
                authId
              }
            }
          }
        }
      `,
      variables: {
         teamId: teamId
       }
    },
    headers: {
      authorization: authorization,
    },
  })

  logger.debug('isUserAuthorized -> Checking authorization from team members.')
  if(isDefined(teamsQuery.data.data.teams_TeamById)){
    let team = teamsQuery.data.data.teams_TeamById
    for (var i = 0; i < team.members.length; i++) {
      if(team.members[i].member.authId === authId){
        logger.debug('isUserAuthorized -> User is authorized.')
        return true
      }
    }
  }
}

export default isUserAuthorized