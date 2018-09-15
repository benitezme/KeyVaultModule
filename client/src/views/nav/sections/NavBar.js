import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {AppBar, Typography, IconButton, Toolbar} from '@material-ui/core'

import BrowseIcon from '@material-ui/icons/ImportContacts'
import HomeIcon from '@material-ui/icons/Home'

import { Link } from 'react-router-dom'
import { getItem } from '../../../utils/local-storage'

// components
import LoggedInUser from './LoggedInUser'
import LoggedOut from './LoggedOut'

import AALogo from '../../../img/aa-logo-dark-8.png'

const BrowseLink = props => <Link to='/browse' {...props} />
const HomeLink = props => <Link to='/' {...props} />

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
  },
  img: {
    margin: 20,
    display: 'block',
    maxWidth: 120,
    maxHeight: 24
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
            <img className={classes.img} src={AALogo} alt='Advanced Algos' />
            <Typography variant='title' color='inherit' className={classes.flex}>
              Key Vault
            </Typography>

            <IconButton className={classes.menuButton} color='inherit' title='Home' component={HomeLink}><HomeIcon /></IconButton>
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
