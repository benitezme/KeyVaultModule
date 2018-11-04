import axios from 'axios'
import logger from '../../config/logger'

const isUserAuthorized = async(authorization, botId) => {
  logger.debug('AuthorizeUser -> Checking authorization.')
  await axios({
    url: process.env.GATEWAY_ENDPOINT,
    method: 'post',
    data: {
      query: `
        {
          teams_FbByTeamMember{
            fb{
              name
              slug
            }
          }
        }
      `,
    },
    headers: {
      authorization: authorization,
    },
  }).then(
    (result) => {
      if (result.data.data.teams_FbByTeamMember !== null
          && result.data.data.teams_FbByTeamMember !== undefined){
        if (result.data.data.teams_FbByTeamMember.fb.some(
              fb => fb.slug === botId)) {
          logger.debug('AuthorizeUser -> User is authorized.')
          return true
        } else {
          logger.debug('AuthorizeUser -> User is not authorized.')
          return false
        }
      } else{
        logger.debug('AuthorizeUser -> User is not authorized.')
        return false
      }

    })
}

export default isUserAuthorized
