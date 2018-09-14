import React, { Component } from 'react'
import EditKey from './EditKey'

// Images
import Poloniex from '../../../img/poloniex.png'
import Binance from '../../../img/binance.png'

// Material-ui
import {
  Grid, Paper, Typography, ButtonBase, Button,
  Dialog, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 20,
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
                <Typography gutterBottom variant='headline'>Key: {key.key}</Typography>
                <Typography gutterBottom>Type: {key.type}</Typography>
                <Typography gutterBottom>Description: {key.description}</Typography>
                <Typography gutterBottom>Valid From: {key.validFrom}</Typography>
                <Typography gutterBottom>Valid To: {key.validTo}</Typography>
                <Typography gutterBottom>Active: {key.active !== null ? key.active.toString():''}</Typography>
                <Typography gutterBottom>Boot: {key.botId}</Typography>
              </Grid>
              <Grid item className={classes.buttonGrid}>
                <Button
                  className={classes.buttonList}
                  variant='outlined' color='primary' size='small'
                  onClick={() => this.editKey()}
                  >Edit</Button>

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
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    )
  }

  handleEditKeyDialogOpen = () => {
    this.setState({ isEditKeyDialogOpen: true })
  };

  handleEditKeyDialogClose = () => {
    this.setState({ isEditKeyDialogOpen: false })
  };

  editKey () {
    this.setState({ isEditKeyDialogOpen: true })
  }

  getImage (exchange) {
    if (exchange === '1') {
      return Poloniex
    } else if (exchange === '2'){
      return Binance
    }
  }
}

export default withStyles(styles)(ListKeys)
