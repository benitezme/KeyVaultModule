import React, { Component } from 'react'
import AddKey from './AddKey'
import EditKey from './EditKey'

// Material-ui
import AddIcon from '@material-ui/icons/Add'
import { withStyles } from '@material-ui/core/styles'
import {
  Button, Dialog, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core'

const styles = theme => ({
  button: {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
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

  renderContent(){
    if(this.props.isEdit){
      return (
        <EditKey handleNewKeyDialogClose={this.handleNewKeyDialogClose} selected={this.state.selected}/>
      )
    }else{
      return (
        <EditKey handleNewKeyDialogClose={this.handleNewKeyDialogClose} selected={this.state.selected}/>
      
      )
    }
  }

  // <AddKey handleNewKeyDialogClose={this.handleNewKeyDialogClose}/>

  renderTitle(){
    if (this.props.isEdit){
      return 'Edit Key'
    }else{
      return 'Add a new Key'
    }
  }

  render () {
    const { classes } = this.props
    return (
      <div key='addNewKey'>
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
            { this.renderTitle() }
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              You will need to complete this form with the information from
              the exchange.
            </DialogContentText>
            { this.renderContent() }
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(KeyDialog)
