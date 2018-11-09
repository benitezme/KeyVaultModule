import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { getKeysQuery } from '../../../queries'

import TopBar from '../../nav'

import KeyDialog from './KeyDialog'
import ListKeys from './ListKeys'

// Material-ui
import { Typography, Paper } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 10,
    width: '70%',
    marginLeft: '15%',
  }
})

class BrowseKeys extends Component {

  constructor (props) {
    super(props)
    let user = localStorage.getItem('user')
    this.state = {
      user: JSON.parse(user)
    }
  }

  render () {
    const { classes } = this.props
    const data = this.props.data

    if (data.loading) {
      return (
        <React.Fragment>
          <TopBar
            size='medium'
            title='Browse Keys'
            text=''
            backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
          />
          <div className={classes.root}>
            <Typography variant='subtitle1'>Loading keys...</Typography>
          </div>
        </React.Fragment>
      )
    } else if (data.keyVault_Keys && data.keyVault_Keys.length > 0) {
      return this.displayKeys()
    } else if (data.error) {
        return (
          <React.Fragment>
            <TopBar
              size='medium'
              title='Browse Keys'
              text=''
              backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
            />
            <div className={classes.root}>
              <Typography className={classes.root} variant='subtitle1'>Please Login to access your keys.</Typography>
            </div>
          </React.Fragment>
        )
    } else {
      return (
        <React.Fragment>
          <TopBar
            size='medium'
            title='Browse Keys'
            text=''
            backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
          />
          <div className={classes.root}>
            <Typography className={classes.root} variant='subtitle1'>You don't have any keys yet. After you create a new key, it will be listed here.</Typography>
          </div>
        </React.Fragment>
      )
    }
  }

  displayKeys () {
    var data = this.props.data
    const { classes } = this.props
    return data.keyVault_Keys.map((key, i) => {
      return (
        <React.Fragment>
          <TopBar
            size='medium'
            title='Manage Keys'
            text=''
            backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
          />
          <div key={key.id} className={classes.root}>
            <ListKeys currentKey={key} />
          </div>
        </React.Fragment>
      )
    })
  }
}

export default compose(
  graphql(getKeysQuery),
  withStyles(styles)
)(BrowseKeys)
