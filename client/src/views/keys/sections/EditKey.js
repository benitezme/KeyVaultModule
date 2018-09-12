import React, { Component } from 'react'
import {graphql, compose} from 'react-apollo'
import { getKeyQuery, getKeysQuery } from '../../../queries'

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
const exchanges = [ 'Poloniex', 'Binance' ]

class EditKey extends Component {

  constructor(props){
    super(props)
    this.state = {
      type:'',
      description:'',
      validFrom: '',
      validTo: '',
      active:'',
      botId:'',
      showPassword : false, //for showing the secret
    }
  }

  submitForm(e){
    e.preventDefault()
    const err = this.validate()
    if (err){
      this.props.addKeyMutation({ //TODO change to modify key
        variables:{
          type: this.state.type,
          description: this.state.description,
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
            value={this.state.secret}
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
               <MenuItem key={option} value={option}>{option}</MenuItem>
             ))}
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
               Edit Key
             </Button>
           </div>

      </form>
    );
  }

  displayBots(){
    var bots = ['Artudito', 'Robert'];
    return bots.map(bot => {
      return (
        <MenuItem key={bot} value={bot}>{bot}</MenuItem>
      )
    })
  }
}

export default compose(
  graphql(getKeyQuery, {
    options: (props) => {
      return {
        variables: {
          id: props.keyId
        }
      }
    }
  }),
  withStyles(styles)
)(EditKey)
