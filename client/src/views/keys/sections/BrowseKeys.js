import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { getKeysQuery } from '../../../queries'
import TopBar from '../../nav'
import KeyDialog from './KeyDialog'
import ListKeys from './ListKeys'

// Material-ui
import { Typography, Paper } from '@material-ui/core'

class BrowseKeys extends Component {

  constructor (props) {
    super(props)
    let user = localStorage.getItem('user')
    this.state = {
      user: JSON.parse(user)
    }
  }

  render () {
    return (
      <React.Fragment>
        <TopBar
          size='medium'
          title='Browse Keys'
          text=''
          backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
        />
        <div className='container'>
          { this.getBodyContent(this.props.data) }
        </div>
      </React.Fragment>
    )
  }

  getBodyContent (data) {
    if (data.loading) {
      return (
        <Typography variant='subtitle1'>Loading keys...</Typography>
      )
    } else if (data.keyVault_Keys && data.keyVault_Keys.length > 0) {
      return data.keyVault_Keys.map((key, i) => {
        return (
          <ListKeys key={key.id} currentKey={key} />
        )
      })
    } else if (data.error) {
      return (
        <Typography variant='subtitle1'>Please Login to access your keys.</Typography>
      )
    } else {
      return (
        <Typography variant='subtitle1'>You don't have any keys yet. After you create a new key, it will be listed here.</Typography>
      )
    }
  }

}

export default graphql(getKeysQuery)(BrowseKeys)
