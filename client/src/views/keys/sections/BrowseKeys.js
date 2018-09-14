import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { getKeysQuery } from '../../../queries'
import { getItem } from '../../../utils/local-storage'

import KeyDialog from './KeyDialog'
import ListKeys from './ListKeys'

// Material-ui
import { Typography, Paper } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 20,
    margin: 10
  }
})

class BrowseKeys extends Component {

  constructor (props) {
    super(props)
    this.state = {
      selected: 'selected1',
      user: null
    }
  }

  componentDidMount () {
    this._asyncRequest = getItem('user').then(
      user => {
        this._asyncRequest = null
        this.setState({user: JSON.parse(user)})
      }
    )
  }

  render () {
    const { classes } = this.props
    const data = this.props.data
    if (data.loading) {
      return (
        <Paper className={classes.root}>
          <Typography variant='subheading'>Loading keys...</Typography>
        </Paper>
      )
    } else if (data.keys && data.keys.length > 0) {
      return this.displayKeys()
    } else if (data.error) {
      return (
        <Paper className={classes.root}>
          <Typography className={classes.root} variant='subheading'>There has been an error.</Typography>
        </Paper>
      )
    } else {
      return (
        <Paper className={classes.root}>
          <Typography className={classes.root} variant='subheading'>You don't have any keys yet.</Typography>
          <KeyDialog />
        </Paper>
      )
    }
  }

  displayKeys () {
    var data = this.props.data
    const length = data.keys.length
    return data.keys.map((key, i) => {
      if (length === i + 1) {
        return (
          <React.Fragment key='keyList'>
            <ListKeys key={key.id} currentKey={key} />
            <KeyDialog key='addKeyDialog' />
          </React.Fragment>
        )
      } else {
        return <ListKeys key={key.id} currentKey={key} />
      }
    })
  }
}

export default compose(
  graphql(getKeysQuery),
  withStyles(styles)
)(BrowseKeys)
