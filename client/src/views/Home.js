import React, { Component } from 'react'

import { Typography, Paper, List, ListItem, ListItemText , Avatar} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import ActivityIcon from '@material-ui/icons/LibraryBooks';
import AssingIcon from '@material-ui/icons/CompareArrows';
import StoreIcon from '@material-ui/icons/SaveAlt';
import ManageIcon from '@material-ui/icons/VerticalSplit';

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
      <Paper className={classes.root}>
        <Typography gutterBottom variant='display3'>Welcome! On this module you will be able to:</Typography>

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
            <ListItemText primary="Assign one or more keys to a Financial Being." />
          </ListItem>

          <ListItem>
            <Avatar>
              <ActivityIcon />
            </Avatar>
            <ListItemText primary="Review activity associated to your keys. (On Development)" />
          </ListItem>
        </List>

        <Typography gutterBottom variant='caption'>Please login at the right top corner to get started.</Typography>

      </Paper>
    )
  }
}

export default withStyles(styles)(Home)
