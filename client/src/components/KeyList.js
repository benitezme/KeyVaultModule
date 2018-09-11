import React, { Component } from 'react'
import {graphql} from 'react-apollo'
import {getKeysQuery} from '../queries/queries'
import { getItem } from '../utils/local-storage'

// Material-ui
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ButtonBase from '@material-ui/core/ButtonBase'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import AddKey from './AddKey'

import {Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle} from '@material-ui/core';

import { compose } from 'recompose'

// Images
import Poloniex from '../img/poloniex.png'
import Binance from '../img/binance.png'

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
  button: {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
  },
  buttonList: {
    marginRight: 20,
  },
})

class KeyList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      selected: '',
      user: null,
      newKeyOpen: false
    }
  }

  handleNewKeyOpen = () => {
    this.setState({ newKeyOpen: true });
  };

  handleNewKeyClose = () => {
    this.setState({ newKeyOpen: false });
  };

  addKey(){
    const { classes } = this.props
    return (
      <div key='addNewKey'>
      <Button variant="fab" color="primary"
        aria-label="addNewKey" className={classes.button}
        onClick={this.handleNewKeyOpen} >
          <AddIcon />
      </Button>
      <Dialog
          open={this.state.newKeyOpen}
          onClose={this.handleNewKeyClose}
          aria-labelledby="addKey-dialog-title"
        >
          <DialogTitle id="addKey-dialog-title">Add a new Key</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You will need to complete this form with the information from
              the exchange.
            </DialogContentText>

            <AddKey/>

          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleNewKeyClose} color="primary">
              Add Key
            </Button>
            <Button onClick={this.handleNewKeyClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  disableKey(){
    console.log("disable")
  }

  editKey(){
    console.log("edit")
  }

  getImage(exchange){
    if(exchange === "Poloniex"){
      return Poloniex;
    }else {
      return Binance;
    }
  }

  displayKeys () {
    var data = this.props.data
    const { classes } = this.props
    const length = data.keys.length
    return data.keys.map((key, i) => {
      if(length === i + 1){
        return this.addKey()
      } else{
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
                    <Typography gutterBottom>Active: {key.active.toString()}</Typography>
                    <Typography gutterBottom>Boot: {key.botId}</Typography>
                    </Grid>
                  <Grid item>
                    <Button
                      className={classes.buttonList}
                      variant="outlined" color="primary" size="small"
                      onClick={()=>this.editKey()}
                      >Edit</Button>
                    <Button
                      className={classes.buttonList}
                      variant="outlined" color="secondary" size="small"

                      onClick={()=>this.disableKey()}
                      >Disable</Button>

                    {/* <Typography
                      style={{ cursor: 'pointer' }}
                      onClick={this.disableKey()}
                      >Disable</Typography> */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        )
      }
    })
  }

  componentDidMount () {
    this._asyncRequest = getItem('user').then(
      user => {
        this._asyncRequest = null
        this.setState({user: JSON.parse(user)})
      }
    )
  }

  render () {
    var data = this.props.data
    const { classes } = this.props
    if (data.loading) {
      return <Typography key='loading' className={classes.root} variant='subheading'>Loading keys...</Typography>
    } else if (data.keys) {
        return this.displayKeys()
      } else {
        return <Typography key='loading' className={classes.root} variant='subheading'>You don't have any key yet</Typography>
      }
  }
}

KeyList.propTypes = {
  classes: PropTypes.object.isRequired
}

export default compose(
  graphql(getKeysQuery),
  withStyles(styles)
)(KeyList)
