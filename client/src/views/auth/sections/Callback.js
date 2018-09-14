import React, { Component } from 'react'

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

class Callback extends Component {
  render () {
    const { classes } = this.props
    return (
      <Paper className={classes.root}>
        <Typography variant='subheading'>Authenticating...</Typography>
      </Paper>
    )
  }
}

export default withStyles(styles)(Callback)
