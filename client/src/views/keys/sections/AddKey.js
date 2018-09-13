import React, { Component } from 'react'
import {graphql, compose} from 'react-apollo'
import {getExchangesQuery, addKeyMutation, getKeysQuery} from '../../../queries'

//Material-ui
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import {
   MenuItem, Button, IconButton, InputAdornment, TextField,
   FormControl, InputLabel, Input
} from '@material-ui/core'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 20,
    height: '100%'
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
    position: 'fixed',
    bottom: '10px',
    right: '10px',
  },
  actionButton: {
    textAlign: 'center',
    marginTop: 10
  },

});

const types = [ 'Development', 'Live', 'Competition' ]

class AddKey extends Component {

  constructor(props){
    super(props);
    this.state = {
      key:'',
      keyError:'',
      secret:'',
      type:'',
      description:'',
      exchange:'',
      validFrom: '',
      validTo: '',
      active:'',
      botId:'',
      showPassword : false, //for showing the secret
    }
  }

  displayExchanges(){
    var data = this.props.getExchangesQuery
    if(data.loading){
      return <option>Loading exchanges...</option>
    }else{
      return data.exchanges.map(exchange => {
        return (
          <MenuItem key={exchange.id} value={exchange.id}>
            {exchange.name}
          </MenuItem>
        )
      })
    }
  }

  displayBots(){
    var bots = ['Artudito', 'Robert'];
    return bots.map(bot => {
      return (
        <MenuItem key={bot} value={bot}>
          {bot}
        </MenuItem>
      )
    })
  }

  submitForm(e){
    e.preventDefault()
    const err = this.validate()
    if (err){
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

      this.props.handleNewKeyDialogClose()
    }
  }

  validate(){
    let isError = false
    const errors = {}

    if(this.state.key.length < 1) {
      isError = true
      errors.keyError = "Key can't be empty."
    }

    if(isError){
      this.setState({
        ...this.state,
        ...errors
      })
    }

    return errors;

  }

  handleMouseDownPassword = event => {
     event.preventDefault();
   };

  handleClickShowPassword = () => {
      this.setState(state => ({ showPassword: !state.showPassword }));
    };

  //TODO create keys types on schema, field Type
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
        />

        <FormControl className={classNames(classes.margin, classes.textField)}>
          <InputLabel htmlFor="secret">Secret</InputLabel>
          <Input
            id="secret"
            type={this.state.showPassword ? 'text' : 'password'}
            label="Secret"
            value={this.state.secret}
            onChange={(e)=>this.setState({secret:e.target.value})}
            fullWidth
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
           >
             {this.displayExchanges()}
        </TextField>

        <TextField
           select
           label="Type"
           className={classNames(classes.margin, classes.textField)}
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

          <TextField
              id="validFrom"
              label="Valid From"
              type="datetime-local"
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
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e)=>this.setState({validTo:e.target.value})}
            fullWidth
          />

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
             <Button
               type="submit"
               variant="outlined" color="primary">
               Add Key
             </Button>
           </div>

      </form>
    );
  }
}

export default compose(
  compose(
    graphql(getExchangesQuery,{name:'getExchangesQuery'}),
    graphql(addKeyMutation,{name:'addKeyMutation'})
  ),
  withStyles(styles)
)(AddKey)
