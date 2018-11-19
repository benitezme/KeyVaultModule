import React, { Component } from 'react'
import EditKey from './EditKey'
import AuditLogList from './AuditLogList'
import { graphql, compose } from 'react-apollo'
import { removeKeyMutation, getKeysQuery } from '../../../queries'
// Images
import Poloniex from '../../../img/poloniex.png'
import Binance from '../../../img/binance.png'

// Material-ui
import {
  Grid, Paper, Typography, ButtonBase, Button,
  Dialog, DialogContent, DialogContentText, DialogTitle,
  DialogActions
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 10,
    margin: 10
  },
  image: {
    width: 128,
    height: '100%',
    cursor: 'default'
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%'

  },
  buttonList: {
    margin: theme.spacing.unit,
    float: 'right',
  },
  buttonGrid: {
    marginTop: -20,
  }

})

class ListKeys extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isEditKeyDialogOpen: false,
      isAuditLogDialogOpen: false,
      isRemoveDialogOpen: false
    }
  }

  render () {
    const { classes } = this.props
    const key = this.props.currentKey
    return (
      <Paper key={key.id} className={classes.root}>
        <Grid container spacing={16}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt='complex' src={this.getImage(key.exchange)} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction='column' spacing={16}>
              <Grid item xs>
                <Typography gutterBottom variant='h5'>Key: {key.key}</Typography>
                <Typography gutterBottom>Bot: {key.botId}</Typography>
                <Typography gutterBottom>Type: {key.type}</Typography>
              </Grid>
              <Grid item className={classes.buttonGrid}>
                <Button
                  className={classes.buttonList}
                  variant='contained' color='secondary' size='small'
                  onClick={() => this.auditLog()}>
                  Audit Log
                </Button>
                <Button
                  className={classes.buttonList}
                  variant='contained' color='secondary' size='small'
                  onClick={this.handleRemoveDialogOpen}>
                  Delete
                </Button>
                <Button
                  className={classes.buttonList}
                  variant='contained' color='secondary' size='small'
                  onClick={() => this.editKey()}>
                  Edit
                </Button>

                <Dialog
                    open={this.state.isEditKeyDialogOpen}
                    onClose={this.handleEditKeyDialogClose}
                    aria-labelledby="addKey-dialog-title"
                  >
                    <DialogTitle id="addKey-dialog-title">
                      Edit Key
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        You will need to complete this form with the information from
                        the exchange.
                      </DialogContentText>

                      <EditKey currentKey={key} handleEditKeyDialogClose={this.handleEditKeyDialogClose}/>

                    </DialogContent>
                  </Dialog>

                  <Dialog
                      open={this.state.isAuditLogDialogOpen}
                      onClose={this.handleAuditLogDialogClose}
                      aria-labelledby="auditLog-dialog-title"
                    >
                      <DialogTitle id="auditLog-dialog-title">
                        Audit Log History
                      </DialogTitle>
                      <DialogContent>
                        <AuditLogList currentKey={key} handleEditKeyDialogClose={this.handleAuditLogDialogClose}/>
                      </DialogContent>
                  </Dialog>

                  <Dialog
                      open={this.state.isRemoveDialogOpen}
                      onClose={this.handleRemoveDialogClose}
                      aria-labelledby="removeKey-dialog-title"
                    >
                      <DialogTitle id="removeKey-dialog-title">
                        Delete Key
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Are you sure you want to delete this key?
                          Deleting this key will prevent any running bots associated to this key to access your account at the exchange.
                        </DialogContentText>

                        <DialogActions>
                          <Button onClick={this.handleRemoveDialogOK} color="primary">
                            Proceed
                          </Button>
                          <Button onClick={this.handleRemoveDialogCancel} color="primary" autoFocus>
                            Cancel
                          </Button>
                        </DialogActions>
                      </DialogContent>
                    </Dialog>

              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    )
  }

  editKey () {
    this.setState({ isEditKeyDialogOpen: true })
  }

  removeKey (key) {
    this.props.mutate({
      variables:{
        id: key.id
      },
      refetchQueries: [{query: getKeysQuery}]
    })
  }

  handleEditKeyDialogClose = () => {
    this.setState({ isEditKeyDialogOpen: false })
  }

  auditLog () {
    this.setState({ isAuditLogDialogOpen: true })
  }

  handleAuditLogDialogClose = () => {
    this.setState({ isAuditLogDialogOpen: false })
  }

  handleRemoveDialogOpen = () => {
    this.setState({ isRemoveDialogOpen: true })
  }

  handleRemoveDialogOK = () => {
    this.removeKey(this.props.currentKey)
    this.setState({ isRemoveDialogOpen: false })
  }

  handleRemoveDialogCancel = () => {
    this.setState({ isRemoveDialogOpen: false })
  }


  getImage (exchange) {
    if (exchange === '1') {
      return Poloniex
    } else if (exchange === '2'){
      return Binance
    }
  }
}

export default compose(
  graphql(removeKeyMutation),
  withStyles(styles)
)(ListKeys)
