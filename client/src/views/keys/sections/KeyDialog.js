import React, { Component } from 'react'
import AddKey from './AddKey'

// Material-ui
import AddIcon from '@material-ui/icons/Add'
import { withStyles } from '@material-ui/core/styles'
import {
  Button, Dialog, DialogContent, DialogContentText, DialogTitle, Paper, Typography
} from '@material-ui/core'

const styles = theme => ({
  button: {
    display: 'block',
    marginTop: '1em',
    marginLeft: 'auto',
    lineHeight: '1em',
    marginRight: 'auto',
  },
  root:{
    flexGrow: 1,
    padding: 20,
    margin: 10
  },
})

class KeyDialog extends Component {

  constructor (props) {
    super(props)
    this.state = {
      selected:'',
      isNewKeyDialogOpen: false,
    }
  }

  handleNewKeyDialogOpen = () => {
    this.setState({ isNewKeyDialogOpen: true })
  };

  handleNewKeyDialogClose = () => {
    this.setState({ isNewKeyDialogOpen: false })
  };

  render () {
    const { classes } = this.props
    return (
        <Paper className={classes.root}>
          <Typography gutterBottom variant='headline'>Create another Key:</Typography>
          <Button variant="fab" color="primary"
            aria-label="addNewKey" className={classes.button}
            onClick={this.handleNewKeyDialogOpen} >
              <AddIcon />
          </Button>
          <Dialog
              open={this.state.isNewKeyDialogOpen}
              onClose={this.handleNewKeyDialogClose}
              aria-labelledby="addKey-dialog-title"
            >
              <DialogTitle id="addKey-dialog-title">
                Add a new Key
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  You will need to complete this form with the information from
                  the exchange. The available bots are retrieved from the Teams you have, make
                  sure you setup your team first!
                </DialogContentText>
                <AddKey handleNewKeyDialogClose={this.handleNewKeyDialogClose}/>
              </DialogContent>
            </Dialog>
          </Paper>
    )
  }
}

export default withStyles(styles)(KeyDialog)
