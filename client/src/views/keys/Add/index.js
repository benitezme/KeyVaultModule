import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import TopBar from '../../nav'
import { withStyles } from '@material-ui/core/styles'
import {
   MenuItem, Button, IconButton, InputAdornment, TextField,
   FormControl, InputLabel, Input, Typography, Paper, Dialog,
   DialogTitle, DialogContent, DialogContentText, DialogActions,
   FormControlLabel, Checkbox
} from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import styles from './styles'
import classNames from 'classnames'
import { addKeyMutation, getKeysQuery } from '../../../queries'
import { exchanges} from '../../../queries/models'
import { isDefined } from '../../../utils'

class AddKey extends Component {

  constructor(props){
    super(props)
    let user = localStorage.getItem('user')
    this.state = {
      user: JSON.parse(user),
      key: '',
      secret: '',
      exchange: '',
      type: '',
      description: '',
      validFrom: 0,
      validTo: 0,
      active: true,
      defaultKey: false,
      showPassword : false,
      keyError: false,
      secretError: false,
      exchangeError: false,
      isNewKeyDialogOpen: false,
      serverResponse: '',
      serverError: false
    }
  }

  handleMouseDownPassword = event => {
     event.preventDefault();
   };

  handleClickShowPassword = () => {
      this.setState(state => ({ showPassword: !state.showPassword }));
    };

  render() {
    const { classes } = this.props
    if( !isDefined(this.state.user) ) {
      return (
        <TopBar
          size='big'
          title='Add Key'
          text="Please login to add a new key."
          backgroundUrl='https://superalgos.org/img/photos/key-vault.jpg'
        />
      )
    } else return (
        <React.Fragment>
          <TopBar
            size='medium'
            title='Add Key'
            text='Add a new Exchange Key here.'
            backgroundUrl='https://superalgos.org/img/photos/key-vault.jpg'
          />

          <div className='container'>
          <Paper className={classNames('container', classes.root)}>

          <form noValidate autoComplete="off" onSubmit={this.submitForm.bind(this)}>

              <Typography className={classes.typography} variant='h5' gutterBottom>
                New Exchange Key
              </Typography>

              <Typography className={classes.typography} variant='subtitle1' align='justify'>
                In order for your bots to access your own account at the Exchange,
                first you need to create a key at the exchange and register that key
                here, at the Superalgos Key Vault. If you have doubts on how to
                create a key at the Exchange, please check this
                 <a href="https://superalgos.org/documentation-poloniex-api-key.shtml"
                  target="_blank">tutorial</a>.
              </Typography>

            <TextField
                id="key"
                label="Key"
                className={classNames(classes.form, classes.textField)}
                value={this.state.key}
                onChange={(e)=>this.setState({key:e.target.value})}
                onBlur={(e)=>this.setState({keyError:false})}
                error={this.state.keyError}
                autoComplete="false"
                fullWidth
              />

            <FormControl className={classNames(classes.margin, classes.textField)}>
              <InputLabel htmlFor="secret">Secret</InputLabel>
              <Input
                id="secret"
                type={this.state.showPassword ? 'text' : 'password'}
                label="Secret"
                value={this.state.secret}
                onChange={(e)=>this.setState({secret:e.target.value})}
                onBlur={(e)=>this.setState({secretError:false})}
                error={this.state.secretError}
                fullWidth
                autoComplete="false"
                endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
              />
            </FormControl>

            <Typography className={classes.typography} variant='subtitle1' align='justify'>
              For now, the only exchange available on the platform is Poloniex.
            </Typography>

            <TextField
               select
               label="Exchange"
               className={classNames(classes.margin, classes.textField, classes.form)}
               value={this.state.exchange}
               onChange={(e)=> this.setState({exchange:e.target.value})}
               onBlur={(e)=>this.setState({exchangeError:false})}
               error={this.state.exchangeError}
               fullWidth
               >
                 {exchanges.map(option => (
                   <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                 ))}
            </TextField>

            <Typography className={classes.typography} variant='subtitle1' align='justify'>
              If you select this as the default key, this is the one that will be
              used to run the bot directly from the browser.
              That way you can test everything is looking good before put it to
              run on the Virtual Machine as a clone.
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.defaultKey}
                  onChange={(e)=>this.setState({defaultKey:e.target.checked })}
                  color="primary"
                />
              }
              label="Default Key"
              className={classNames(classes.form, classes.textField)}
            />

             <div className={classes.actionButton} >
               <Button
                 type="submit"
                 variant='contained' color='secondary'>
                 Add Key
               </Button>
             </div>
          </form>

          <Dialog
            open={this.state.isNewKeyDialogOpen}
            onClose={this.handleNewKeyDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Creating new Key</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                { this.state.serverResponse }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleNewKeyDialogClose} color="primary" autoFocus>
                Ok
              </Button>
            </DialogActions>
          </Dialog>

        </Paper>
        </div>
      </React.Fragment>
    );
  }

    async submitForm(e){
      e.preventDefault()
      let error = this.validate()
      if (!error){
        let serverResponse = await this.props.addKeyMutation({
          variables:{
            key: this.state.key,
            secret: this.state.secret,
            description: this.state.description,
            exchange: this.state.exchange,
            validFrom: this.state.validFrom,
            validTo: this.state.validTo,
            active: this.state.active,
            defaultKey: this.state.defaultKey
          },
          refetchQueries: [{query: getKeysQuery}]
        })

        error = serverResponse.errors || !isDefined(serverResponse.data.keyVault_AddKey)
        if(error){
          this.state.serverResponse = "There was an error creating the key."
          this.state.serverError = true
        }else{
          this.state.serverResponse = "The new key was sucessfully created."
          this.state.serverError = false
        }

        this.handleNewKeyDialogOpen()
      }
    }

    handleNewKeyDialogOpen = () => {
      this.setState({ isNewKeyDialogOpen: true })
    };

    handleNewKeyDialogClose = () => {
      this.setState({
        isNewKeyDialogOpen: false
      })
      if(!this.state.serverError)
        this.setState({
          key: '',
          secret: '',
          exchange: '1',
          description: '',
          validFrom: 0,
          validTo: 0,
          active: true,
          showPassword : false,
          keyError: false,
          secretError: false,
          exchangeError: false,
          isNewKeyDialogOpen: false,
          defaultKey: false,
          serverResponse: '',
          serverError: false
        })
    };

    validate(){
      let isError = false

      if(this.state.key.length < 1) {
        isError = true
        this.setState(state => ({ keyError: true }));
      }

      if(this.state.secret.length < 1) {
        isError = true
        this.setState(state => ({ secretError: true }));
      }

      if(this.state.exchange.length < 1) {
        isError = true
        this.setState(state => ({ exchangeError: true }));
      }

      return isError;

    }
}

export default compose(
  graphql(addKeyMutation, { name:'addKeyMutation' }),
  withStyles(styles)
)(AddKey)
