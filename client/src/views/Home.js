import React, { Component } from 'react'

import { Typography, Paper, List, ListItem,
  ListItemText , Avatar, IconButton, Link } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import ActivityIcon from '@material-ui/icons/LibraryBooks';
import AssingIcon from '@material-ui/icons/CompareArrows';
import StoreIcon from '@material-ui/icons/SaveAlt';
import ManageIcon from '@material-ui/icons/VerticalSplit';

import BrowseIcon from '@material-ui/icons/ImportContacts'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 20,
    margin: 10
  }
})

class Home extends Component {

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Typography gutterBottom variant='h4'>On this section you will be able to:</Typography>

        <List>
          <ListItem>
            <Avatar>
              <ManageIcon />
            </Avatar>
            <ListItemText primary="Manage your exchange API keys that will be available for the platform." />
          </ListItem>

          <ListItem>
            <Avatar>
              <StoreIcon />
            </Avatar>
            <ListItemText primary="Store your exchange API key secret that will be used to sing your transactions with the exchange." />
          </ListItem>

          <ListItem>
            <Avatar>
              <AssingIcon />
            </Avatar>
            <ListItemText primary="Assign keys to Financial Beings." />
          </ListItem>

          <ListItem>
            <Avatar>
              <ActivityIcon />
            </Avatar>
            <ListItemText primary="Review activity associated to your keys." />
          </ListItem>
        </List>
      </div>
    )
  }
}

export default withStyles(styles)(Home)
