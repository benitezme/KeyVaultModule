import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LoggedInMenu from './LoggedInMenu'

class LoggedInUser extends Component {

  render () {
    let { user, auth } = this.props
    // console.log('Logged in User: '+JSON.stringify(user));
    let displayName = 'No Display Name'

    if (user.nickname !== null && user.nickname !== '') {
      displayName = user.nickname
    }

    return (
      <div>
        <p>
          <LoggedInMenu menuLabel={displayName} auth={auth} />
        </p>
      </div>
    )
  }
}

LoggedInUser.propTypes = {
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

export default LoggedInUser // This binds the querty to the component
