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
    let data = this.props.data

    if (data.loading) {
      return (
        <TopBar
          size='big'
          title='Your Keys'
          text='Loading your keys...'
          backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
        />
      )
    } else if (data.keyVault_Keys && data.keyVault_Keys.length > 0) {
      return (
        <React.Fragment>
          <TopBar
            size='medium'
            title='Your Keys'
            text='All your exchange keys are here.'
            backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
          />

          <div className='container'>
            {
                data.keyVault_Keys.map((key, i) => {
                  return (
                    <ListKeys key={key.id} currentKey={key} />
                  )
                })
            }
          </div>
        </React.Fragment>
      )
    } else if (data.error) {
      return (
        <TopBar
          size='big'
          title='Your Keys'
          text='Please login to gain access to your keys.'
          backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
        />
      )
    } else {
      return (
        <TopBar
          size='big'
          title='Your Keys'
          text="You don't have any keys yet. Once you create one you will find it here."
          backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
          />
      )
    }
  }

  getBodyContent (data) {
    if (data.loading) {
      return (
        <TopBar
          size='big'
          title='Manage your keys'
          text='Loading keys...'
          backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
        />
      )
    } else if (data.keyVault_Keys && data.keyVault_Keys.length > 0) {
      return (
        <React.Fragment>
          <TopBar
            size='big'
            title='Manage your keys'
            text='Loading keys...'
            backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
        />

          <div className='container'>
            {
              data.keyVault_Keys.map((key, i) => {
                return (
                  <ListKeys key={key.id} currentKey={key} />
                )
              })
          }
          </div>
        </React.Fragment>
      )
    } else if (data.error) {
      return (
        <TopBar
          size='big'
          title='No keys to display'
          text='Please Login to access your keys.'
          backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
        />
      )
    } else {
      return (

        <TopBar
          size='big'
          title='No keys to display'
          text="You don't have any keys yet. After you create a new key, it will be listed here."
          backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
          />
      )
    }
  }

}

export default graphql(getKeysQuery)(BrowseKeys)
