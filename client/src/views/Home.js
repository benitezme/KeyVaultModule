import React, { Component } from 'react'

import { Typography, Paper, List, ListItem,
  ListItemText, Avatar, IconButton, Link } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import TopBar from './nav'

import ActivityIcon from '@material-ui/icons/LibraryBooks'
import AssingIcon from '@material-ui/icons/CompareArrows'
import StoreIcon from '@material-ui/icons/SaveAlt'
import ManageIcon from '@material-ui/icons/VerticalSplit'

import BrowseIcon from '@material-ui/icons/ImportContacts'

class Home extends Component {

  render () {
    return (
      <React.Fragment>
        <TopBar
          size='big'
          title='Key Vault Module'
          text='Responsible for keeping the exchange API keys safe.'
          backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
        />
      </React.Fragment>
    )
  }
}

export default Home
