import React, { Component } from 'react'
import {graphql, compose} from 'react-apollo'
import { getSecret, getKeysQuery, editKeyMutation, getBotsQuery } from '../../../queries'

import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import {
   MenuItem, Button, IconButton, InputAdornment, TextField,
   FormControl, InputLabel, Input, FormControlLabel, Checkbox
} from '@material-ui/core'

import { types, exchanges } from '../../../queries/models'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 20,
    margin: 10
  },
  textField: {
    width: '60%',
    marginLeft:'20%',
    marginBottom: 10
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  actionButton: {
    textAlign: 'center',
    marginTop: 10
  },
});

class EditKey extends Component {

  constructor(props){
    super(props)
    const key = this.props.currentKey
    this.state = {
      id: key.id,
      key: key.key,
      keyError:'',
      secret: '',
      type: key.type,
      description: key.description,
      exchange: key.exchange,
      validFrom:  key.validFrom,
      validTo:  key.validTo,
      active: key.active,
      botId: key.botId,
      showPassword : false, //for showing the secret
    }
  }

  render() {
    const { classes } = this.props
    return (

      <form className={classes.root} noValidate autoComplete="off" onSubmit={this.submitForm.bind(this)}>
        <TextField
          id="key"
          label="Key"
          validators={this.state.keyError}
          className={classes.textField}
          value={this.state.key}
          onChange={(e)=>this.setState({key:e.target.value})}
          fullWidth
          disabled
        />

        <FormControl className={classNames(classes.margin, classes.textField)}>
          <InputLabel htmlFor="secret">Secret</InputLabel>
          <Input
            id="secret"
            type={this.state.showPassword ? 'text' : 'password'}
            label="Secret"
            value={this.props.getSecret.loading ? '' : this.props.getSecret.keyVault_Secret}
            onChange={(e)=>this.setState({secret:e.target.value})}
            fullWidth
            disabled
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

        <TextField
           select
           label="Exchange"
           className={classNames(classes.margin, classes.textField)}
           value={this.state.exchange}
           onChange={(e)=> this.setState({exchange:e.target.value})}
           fullWidth
           disabled
           >
             {exchanges.map(option => (
               <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
             ))}
         </TextField>

         <TextField
           select
           label="Type"
           className={classNames(classes.margin, classes.textField)}
           value={this.state.type}
           onChange={(e)=>this.setState({type:e.target.value})}
           fullWidth
           disabled
           >
             {types.map(option => (
               <MenuItem key={option} value={option}>{option}</MenuItem>
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
              value={this.state.validFrom}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e)=>this.setState({validFrom:e.target.value})}
              fullWidth
            />

          <TextField
            id="validTo"
            label="Valid To"
            type="datetime-local"
            value={this.state.validTo}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e)=>this.setState({validTo:e.target.value})}
            fullWidth
          /> */}

          <TextField
             select
             label="Bot"
             className={classNames(classes.margin, classes.textField)}
             value={this.state.botId}
             onChange={(e)=>this.setState({botId:e.target.value})}
             fullWidth
             >
               {this.displayBots()}
           </TextField>

           <br />

           <div className={classes.actionButton} >
             {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.active}
                    onChange={this.handleChange('active')}
                    value="active"
                    color="primary"
                  />
                }
                label="Active"
              /> */}
             <Button
               type="submit"
               onClick={this.handleEditKeyDialogClose}
               variant="outlined" color="primary">
               Edit Key
             </Button>

           </div>

      </form>
    )
  }

  handleChange = active => event => {
      this.setState({ active: event.target.checked });
    };

  handleMouseDownPassword = event => {
     event.preventDefault();
   };

  handleClickShowPassword = () => {
      this.setState(state => ({ showPassword: !state.showPassword }));
    };

  submitForm(e){
    e.preventDefault()
    this.props.editKeyMutation({
      variables:{
        id: this.state.id,
        type: this.state.type,
        description: this.state.description,
        validFrom: this.state.validFrom,
        validTo: this.state.validTo,
        active: this.state.active,
        botId: this.state.botId
      },
      refetchQueries: [{query: getKeysQuery, getSecret, getAuditLog}]
    })
    this.props.handleEditKeyDialogClose();
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
}

export default compose(
  compose(
    graphql(editKeyMutation,{name:'editKeyMutation'}),
    graphql(getSecret, { // What follows is the way to pass a parameter to a query.
      name: 'getSecret',
      options: (props) => {
        return {
          variables: {
            id: props.currentKey.id
          }
        }
      }
    }),
    graphql(getBotsQuery,{name:'getBotsQuery'}),
  ),
  withStyles(styles)
)(EditKey)
