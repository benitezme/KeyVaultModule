import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import {
  MenuItem, Button, IconButton, InputAdornment, TextField, Typography,
  FormControl, InputLabel, Input, FormControlLabel, Checkbox
} from '@material-ui/core'
import { getSecret, getKeysQuery, editKeyMutation, getAuditLog } from '../../../queries'
import { exchanges } from '../../../queries/models'
import styles from './styles'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'

class EditKey extends Component {

  constructor(props) {
    super(props)
    const key = this.props.currentKey
    this.state = {
      id: key.id,
      key: key.key,
      keyError: '',
      secret: '',
      description: key.description,
      exchange: key.exchange,
      validFrom: key.validFrom,
      validTo: key.validTo,
      active: key.active,
      defaultKey: key.defaultKey,
      showPassword: false,
      activeCloneId: key.activeCloneId
    }
  }

  render() {
    const { classes } = this.props
    return (
      <form className={classes.root} noValidate autoComplete="off"
        onSubmit={this.submitForm.bind(this)}>

        <TextField
          id="key"
          label="Key"
          validators={this.state.keyError}
          className={classes.textField}
          value={this.state.key}
          onChange={(e) => this.setState({ key: e.target.value })}
          fullWidth
          disabled
        />

        <FormControl fullWidth className={classes.textField}>
          <InputLabel htmlFor="secret">Secret</InputLabel>
          <Input
            id="secret"
            type={this.state.showPassword ? 'text' : 'password'}
            label="Secret"
            value={this.props.getSecret.loading ? '' : this.props.getSecret.keyVault_Secret}
            onChange={(e) => this.setState({ secret: e.target.value })}
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
          className={classes.textField}
          value={this.state.exchange}
          onChange={(e) => this.setState({ exchange: e.target.value })}
          fullWidth
          disabled
        >
          {exchanges.map((option, index) => (
            <MenuItem key={index} value={option}>{option}</MenuItem>
          ))}
        </TextField>

        <TextField
          id="description"
          label="Description"
          className={classes.textField}
          value={this.state.description}
          onChange={(e) => this.setState({ description: e.target.value })}
          fullWidth
        />

        {
          this.state.activeCloneId.length > 0 &&
          <React.Fragment>
            <Typography className={classes.textField}>
              This key is currently in use by clon: {this.state.activeCloneId}
            </Typography>
          </React.Fragment>
        }

        { // Disabled for now
        // <FormControlLabel
        //   control={this.state.activeCloneId.length === 0
        //     ? <Checkbox
        //       checked={this.state.defaultKey}
        //       onChange={(e) => this.setState({ defaultKey: e.target.checked })}
        //       color="primary"
        //     />
        //     : <Checkbox
        //       checked={this.state.defaultKey}
        //       onChange={(e) => this.setState({ defaultKey: e.target.checked })}
        //       color="primary"
        //       disabled
        //     />
        //   }
        //   label="Default Key"
        //   className={classNames(classes.form, classes.textField)}
        // />
        }

        <br />

        <div className={classes.actionButtons} >
          <Button className={classes.actionButton}
            type="submit"
            variant='contained' color='secondary'>
            Edit Key
           </Button>
          <Button className={classes.actionButton}
            onClick={(e) => this.props.handleEditKeyDialogClose()}
            variant='contained' color='secondary'>
            Cancel
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

  submitForm(e) {
    e.preventDefault()
    if (!this.state.cancel) {
      this.props.editKeyMutation({
        variables: {
          id: this.state.id,
          description: this.state.description,
          validFrom: this.state.validFrom,
          validTo: this.state.validTo,
          active: this.state.active,
          defaultKey: this.state.defaultKey
        },
        refetchQueries: [{ query: getKeysQuery, getAuditLog }]
      })
    }
    this.props.handleEditKeyDialogClose();
  }
}

export default compose(
  compose(
    graphql(editKeyMutation, { name: 'editKeyMutation' }),
    graphql(getSecret, {
      name: 'getSecret',
      options: (props) => {
        return {
          variables: {
            id: props.currentKey.id
          }
        }
      }
    })
  ),
  withStyles(styles)
)(EditKey)
