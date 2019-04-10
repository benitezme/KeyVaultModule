import React, { Component } from 'react'
import EditKey from '../Edit'
import AuditLogList from '../Audit'
import { graphql, compose } from 'react-apollo'
import { removeKeyMutation, getKeysQuery } from '../../../queries'
import Poloniex from '../../../img/poloniex.png'
import Coss from '../../../img/coss.png'
import {
  Grid, Paper, Typography, ButtonBase, Button,
  Dialog, DialogContent, DialogContentText, DialogTitle,
  DialogActions
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'
import classNames from 'classnames'

class ListKeys extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isEditKeyDialogOpen: false,
      isAuditLogDialogOpen: false,
      isRemoveDialogOpen: false
    }
  }

  render() {
    const { classes } = this.props
    const key = this.props.currentKey
    return (
      <Paper key={key.id} className={classNames(classes.root, classes.block)} >
        <Grid container spacing={16} className={classes.block}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt='complex' src={this.getImage(key.exchange)} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container className={classes.content}>
            <Grid item xs className={classes.content}>
              <Typography gutterBottom variant='h5'>
                Key: {key.defaultKey ? key.key.substr(0, 32) + '... - (Default)' : key.key.substr(0, 32) + "..."}
              </Typography>
            </Grid>
            <Grid item className={classes.content}>
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
            </Grid>

          </Grid>
        </Grid>

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

            <EditKey currentKey={key} handleEditKeyDialogClose={this.handleEditKeyDialogClose} />

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
            <AuditLogList currentKey={key} />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleAuditLogDialogClose} color="primary"
              variant='contained' color='secondary' autoFocus>
              Close
                </Button>
          </DialogActions>
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
              <Button onClick={this.handleRemoveDialogOK} color="primary"
                variant='contained' color='secondary'>
                Proceed
                  </Button>
              <Button onClick={this.handleRemoveDialogCancel} color="primary"
                variant='contained' color='secondary' autoFocus>
                Cancel
                  </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>

      </Paper>
    )
  }

  editKey() {
    this.setState({ isEditKeyDialogOpen: true })
  }

  removeKey(key) {
    this.props.mutate({
      variables: {
        id: key.id
      },
      refetchQueries: [{ query: getKeysQuery }]
    })
  }

  handleEditKeyDialogClose = () => {
    this.setState({ isEditKeyDialogOpen: false })
  }

  auditLog() {
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


  getImage(exchange) {
    if (exchange === 'Poloniex') {
      return Poloniex
    } else if (exchange === 'Coss') {
      return Coss
    }
  }
}

export default compose(
  graphql(removeKeyMutation),
  withStyles(styles)
)(ListKeys)
