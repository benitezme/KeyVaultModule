import axios from 'axios'
import logger from '../../config/logger'

const isUserAuthorized = (authorization, botId) => {
  logger.debug('AuthorizeUser -> Checking authorization.')
  axios({
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
      if (!result.data.data.teams_FbByTeamMember.some(fb => fb.slug === botId)) {
        return false
      } else {
        return true
      }
    )
}

export default isUserAuthorized
