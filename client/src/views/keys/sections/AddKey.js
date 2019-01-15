import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { addKeyMutation, getKeysQuery, getBotsQuery } from '../../../queries'

import TopBar from '../../nav'

//Material-ui
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import { types, exchanges} from '../../../queries/models'

import {
   MenuItem, Button, IconButton, InputAdornment, TextField,
   FormControl, InputLabel, Input, Typography, Paper, Dialog,
   DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@material-ui/core'

const styles = theme => ({
  root: {
    width: '50%',
    flexGrow: 1,
    padding: 10,
    marginLeft: '25%',
    marginTop: '2%',
    marginBottom: 30
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 20,
    height: '100%'
  },
  textField: {
    width: '80%',
    marginLeft:'10%',
    marginBottom: 10
  },
  menu: {
    width: 200,
  },
  button: {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
  },
  actionButton: {
    textAlign: 'center',
    marginTop: 10
  },
  typography: {
    width: '80%',
    marginLeft: '10%',
    marginTop: 20
  },
  form: {
    marginTop: 20
  },

});

class AddKey extends Component {

  constructor(props){
    super(props)
    this.state = {
      key:'',
      secret:'',
      exchange:'',
      type:'',
      description:'',
      validFrom: 0,
      validTo: 0,
      active: true,
      botId:'',
      showPassword : false, //for showing the secret
      keyError: false,
      secretError: false,
      exchangeError: false,
      botIdError: false,
      isNewKeyDialogOpen: false,
    }
  }

  componentDidMount(){
    this.state.type = 'Competition'
    this.state.exchange = '1'
  }

  handleMouseDownPassword = event => {
     event.preventDefault();
   };

  handleClickShowPassword = () => {
      this.setState(state => ({ showPassword: !state.showPassword }));
    };

  render() {
    const { classes } = this.props
    return (
        <React.Fragment>
          <TopBar
            size='medium'
            title='Add Key'
            text=''
            backgroundUrl='https://advancedalgos.net/img/photos/key-vault.jpg'
          />
          <Paper className={classes.root}>

          <form noValidate autoComplete="off" onSubmit={this.submitForm.bind(this)}>

              <Typography className={classes.typography} variant='h5' gutterBottom>
                Add a New Exchange Key
              </Typography>

              <Typography className={classes.typography} variant='subtitle1' align='justify'>
                You will need to complete this section with the information from
                the exchange.
              </Typography>

              <Button  variant="contained" color='secondary' size="small" fullWidth className={classes.typography}
                target="_blank"
                href="https://advancedalgos.net/documentation-poloniex-api-key.shtml">
                Click here for step by step instructions on how to get a key
              </Button>

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
              Please specify the intended use for this key. You must detail if you want to use it for Live Trade or Competitions and with which one of your bots.
            </Typography>

            <TextField
               select
               label="Running Mode"
               className={classNames(classes.margin, classes.textField, classes.form)}
               value={this.state.type}
               onChange={(e)=>this.setState({type:e.target.value})}
               fullWidth
               >
               {types.map(option => (
                 <MenuItem key={option} value={option}>
                   {option}
                 </MenuItem>
               ))}
             </TextField>

             <TextField
               id="description"
               label="Description"
               className={classes.textField}
               value={this.state.description}
               onChange={(e)=>this.setState({description:e.target.value})}
               fullWidth
             />

              {/* <TextField
                  id="validFrom"
                  label="Valid From"
                  type="datetime-local"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e)=>this.setState({validFrom: new Date(e.target.value).getTime()})}
                  fullWidth
                />

              <TextField
                id="validTo"
                label="Valid To"
                type="datetime-local"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e)=>this.setState({validTo: new Date(e.target.value).getTime()})}
                fullWidth
              /> */}

              <TextField
                 select
                 label="Bot"
                 className={classNames(classes.margin, classes.textField)}
                 value={this.state.botId}
                 onChange={(e)=>this.setState({botId:e.target.value})}
                 onBlur={(e)=>this.setState({botIdError:false})}
                 error={this.state.botIdError}
                 fullWidth
                 >
                   { this.displayBots() }
               </TextField>

               <br />

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
            <DialogTitle id="alert-dialog-title">{"Exchange Key Succesfully Added"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Now you will be able to run your bot in competition and live modes using this key. There are no further actions from you required for that.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleNewKeyDialogClose} color="primary" autoFocus>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </React.Fragment>
    );
  }

    displayBots(){
      if(!this.props.getBotsQuery.loading){
        let bots = this.props.getBotsQuery.teams_FbByTeamMember
        if (bots !== undefined && bots.fb.length > 0){
          return bots.fb.map(bot => (
            <MenuItem key={bot.name} value={this.slugify(bot.name)}>{bot.name}</MenuItem>
          ))
        }else{
          return <MenuItem key={'no-bot'} value={''}>You don't have bots yet!</MenuItem>
        }
      }
    }

    slugify(botName){
      const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
      const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
      const p = new RegExp(a.split('').join('|'), 'g')

      return botName
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w-]+/g, '') // Remove all non-word characters
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
    }

    submitForm(e){
      e.preventDefault()
      const err = this.validate()
      if (!err){
        this.props.addKeyMutation({
          variables:{
            key: this.state.key,
            secret: this.state.secret,
            type: this.state.type,
            description: this.state.description,
            exchange: this.state.exchange,
            validFrom: this.state.validFrom,
            validTo: this.state.validTo,
            active: this.state.active,
            botId: this.state.botId
          },
          refetchQueries: [{query: getKeysQuery}]
        })

        this.handleNewKeyDialogOpen()
      }
    }

    handleNewKeyDialogOpen = () => {
      this.setState({ isNewKeyDialogOpen: true })
    };

    handleNewKeyDialogClose = () => {
      this.setState({
        key:'',
        secret:'',
        exchange:'1',
        type:'Competition',
        description:'',
        validFrom: 0,
        validTo: 0,
        active: true,
        botId:'',
        showPassword : false,
        keyError: false,
        secretError: false,
        exchangeError: false,
        botIdError: false,
        isNewKeyDialogOpen: false
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

      if(this.state.botId.length < 1) {
        isError = true
        this.setState(state => ({ botIdError: true }));
      }

      return isError;

    }
}

export default compose(
  graphql(addKeyMutation, { name:'addKeyMutation' }),
  graphql(getBotsQuery, { name: 'getBotsQuery' }),
  withStyles(styles)
)(AddKey)
