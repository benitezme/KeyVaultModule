import React, { Component } from 'react'
import AddKey from '../Add'
import { withStyles } from '@material-ui/core/styles'
import {
  Button, Dialog, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core'

const styles = theme => ({
  button: {
    display: 'block',
    marginLeft: 'auto',
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
        <div className={classes.root}>
          <Button variant="contained" color="secondary"
            aria-label="addNewKey" className={classes.button}
            onClick={this.handleNewKeyDialogOpen} >
              Add a new key
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
          </div>
    )
  }
}

export default withStyles(styles)(KeyDialog)
