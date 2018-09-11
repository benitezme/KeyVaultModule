import React, { Component } from 'react';
import {graphql, compose} from 'react-apollo';
import {getExchangesQuery, addKeyMutation, getKeysQuery} from '../queries/queries';


//Material-ui
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import classNames from 'classnames';

import { compose as composer } from 'recompose';

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
});

const types = [
  {
    value: 'Development',
    label: 'Development',
  },
  {
    value: 'Live',
    label: 'Live',
  },
  {
    value: 'Competition',
    label: 'Competition',
  },
];

class AddKey extends Component {
  constructor(props){
    super(props);
    this.state={
      authId:'',
      key:'',
      secret:'',
      type:'',
      description:'',
      exchangeId:'',
      validFrom: '',
      validTo: '',
      active:'',
      botId:''
    }
  }

  displayExchanges(){
    var data = this.props.getExchangesQuery;
    if(data.loading){
      return <option>Loading exchanges...</option>;
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
    e.preventDefault();
    this.props.addKeyMutation({
      variables:{
        authId: 1, //TODO take the session authId
        key: this.state.key,
        secret: this.state.secret,
        type: this.state.type,
        description: this.state.description,
        exchange: this.state.exchangeId,
        validFrom: this.state.validFrom,
        validTo: this.state.validTo,
        active: this.state.active,
        botId: this.state.botId,
        showPassword : false, //for showing the secret
      },
      refetchQueries: [{query: getKeysQuery}]
    });
  }

  handleMouseDownPassword = event => {
     event.preventDefault();
   };

  handleClickShowPassword = () => {
      this.setState(state => ({ showPassword: !state.showPassword }));
    };

  //TODO create keys types on schema, field Type
  render() {
    const { classes } = this.props;
    return (
      <form className={classes.root} noValidate autoComplete="off" onSubmit={this.submitForm.bind(this)}>

        <TextField
          id="key"
          label="Key"
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
           label="Type"
           className={classNames(classes.margin, classes.textField)}
           value={this.state.type}
           onChange={(e)=>this.setState({type:e.target.value})}
           fullWidth
           >
           {types.map(option => (
             <MenuItem key={option.value} value={option.value}>
               {option.label}
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
            select
            label="Exchange"
            className={classNames(classes.margin, classes.textField)}
            value={this.state.exchangeId}
            onChange={(e)=>this.setState({exchangeId:e.target.value})}
            fullWidth
            >
              {this.displayExchanges()}
          </TextField>

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
             value={this.state.exchangeId}
             onChange={(e)=>this.setState({botId:e.target.value})}
             fullWidth
             >
               {this.displayBots()}
           </TextField>

         {/* <Button variant="fab" color="primary" aria-label="Add"
           className={classes.button} >
                 <AddIcon />
         </Button> */}
         {/* <button>+</button> */}
      </form>
    );
  }
}

AddKey.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default composer(
  compose(
    graphql(getExchangesQuery,{name:'getExchangesQuery'}),
    graphql(addKeyMutation,{name:'addKeyMutation'})
  ),
  withStyles(styles)
)(AddKey);
