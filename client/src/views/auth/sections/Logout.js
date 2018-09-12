import React, { Component } from 'react'
import {Redirect} from 'react-router'

class Logout extends Component {
  render () {
    window.localStorage.removeItem('user')
    window.location.reload() // TODO Fix this
    return <Redirect to='/' />
  }
}

export default Logout
