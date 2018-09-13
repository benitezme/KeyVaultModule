import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {AppBar, Typography, IconButton, Toolbar} from '@material-ui/core'

import BrowseIcon from '@material-ui/icons/ImportContacts'

import { Link } from 'react-router-dom'
import { getItem } from '../../../utils/local-storage'

// components
import LoggedInUser from './LoggedInUser'
import LoggedOut from './LoggedOut'

const BrowseLink = props => <Link to='/browse' {...props} />

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  login: {
    cursor: 'pointer'
  }
}

class NavBar extends Component {

  constructor (props) {
    super(props)
    this.state = {
      authId: null,
      user: null,
    }
  }

  async componentDidMount () {
    const user = await getItem('user')
    this.setState({ user })
  }

  render () {
    const { classes, auth } = this.props
    let user = JSON.parse(this.state.user)
    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='title' color='inherit' className={classes.flex}>
              Key Vault Module
            </Typography>

            {this.state.user !== undefined && this.state.user !== null ? (
              <React.Fragment>
                <IconButton
                  className={classes.menuButton}
                  color='inherit'
                  title='Browse your keys'
                  component={BrowseLink}
                >
                  <BrowseIcon />
                </IconButton>

                <LoggedInUser user={user} auth={auth} styles={styles} />
              </React.Fragment>
            ) : (
              <LoggedOut auth={auth} styles={styles} />
            )}

          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

export default withStyles(styles)(NavBar)
