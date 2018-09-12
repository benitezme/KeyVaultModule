import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { getKeysQuery } from '../../../queries'
import { getItem } from '../../../utils/local-storage'

import KeyDialog from './KeyDialog'
import ListKeys from './ListKeys'

// Material-ui
import { Typography } from '@material-ui/core'
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
        <Typography className={classes.root} variant='subheading'>Loading keys...</Typography>
      )
    } else if (data.keys) {
      return this.displayKeys()
    } else if (data.error) {
      return (
        <Typography className={classes.root} variant='subheading'>There has been an error.</Typography>
      )
    } else {
      return (
        <div>
          <Typography className={classes.root} variant='subheading'>You don't have any key yet.</Typography>
          <KeyDialog />
        </div>
      )
    }
  }

  displayKeys () {
    var data = this.props.data
    const length = data.keys.length
    return data.keys.map((key, i) => {
      if (length === i + 1) {
        return <KeyDialog key={key.id} />
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
