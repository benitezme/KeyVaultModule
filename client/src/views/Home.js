import React, { Component } from 'react'

import { Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    marginTop: 20,
    marginLeft: 20
  }
})

class Home extends Component {

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Typography gutterBottom variant='headline'>Welcome to the Key Vault Module Home Page.</Typography>
        <Typography gutterBottom variant='headline'>On this module you will be able to:</Typography>
        <Typography gutterBottom variant='headline'> - Manage your exchange keys.</Typography>
        <Typography gutterBottom variant='headline'> - Manage your bot associations.</Typography>
        <Typography gutterBottom variant='headline'>Please login at the right top corner to get started.</Typography>
      </div>
    )
  }
}

export default withStyles(styles)(Home)
