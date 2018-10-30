import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import {AppBar, Typography, Button, Toolbar} from '@material-ui/core'

import ManageKeysIcon from '@material-ui/icons/VpnKey'
import AddKeyIcon from '@material-ui/icons/AddCircleOutline'
import HomeIcon from '@material-ui/icons/Home'
import AuditLogIcon from '@material-ui/icons/ImportContacts'

import { Link } from 'react-router-dom'

const HomeLink = props => <Link to='/key-vault' {...props} />
const BrowseLink = props => <Link to='/key-vault/browse' {...props} />
const AddKeyLink = props => <Link to='/key-vault/addKey' {...props} />

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1,
    marginLeft: 30
  },
  cssRoot: {
    color: '#FFFFFF',
    backgroundColor: theme.palette.secondary,
    '&:hover': {
      backgroundColor: theme.palette.dark
    },
    whiteSpace: 'nowrap',
    paddingRight: 2 * theme.spacing.unit,
    paddingLeft: 2 * theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
})

class NavBar extends Component {

  constructor (props) {
    super(props)
    this.state = {
      user: null
    }
  }

  async componentDidMount () {
    const user = localStorage.getItem('user')
    this.setState({ user })
  }

  render () {
    const { classes, auth, match } = this.props
    let user = JSON.parse(this.state.user)
    return (
      <div className={classes.root}>
        <AppBar position='static' color='secondary'>
          <Toolbar variant="dense">

            <Typography variant='h5' color='inherit' className={classes.flex}>
              Key Vault
            </Typography>

            {this.state.user !== undefined && this.state.user !== null ? (
                <React.Fragment>
                  <Button
                    variant='text'
                    size='small'
                    className={classNames(classes.button, classes.cssRoot)}
                    title='Browse Keys'
                    component={BrowseLink}
                    to={`${match.url}/browse`}>
                    <ManageKeysIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                    Manage Keys
                  </Button>

                  <Button
                    variant='text'
                    size='small'
                    className={classNames(classes.button, classes.cssRoot)}
                    title='Add Key'
                    component={AddKeyLink}
                    to={`${match.url}/addKey`}>
                    <AddKeyIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                    Add Key
                  </Button>

                </React.Fragment>
              ) : (
                <React.Fragment />
              )}



          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

NavBar.propTypes = {
  match: PropTypes.object.isRequired
}

export default withStyles(styles)(NavBar)
