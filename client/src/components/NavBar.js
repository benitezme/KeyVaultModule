import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import {AppBar, Typography, IconButton, Toolbar} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import BrowseIcon from '@material-ui/icons/ImportContacts';

import { Link } from 'react-router-dom';

// components
import LoggedInUser from './LoggedInUser';

const HomeLink = props => <Link to="/" {...props} />
const BrowseLink = props => <Link to="/browse" {...props} />

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  login: {
    cursor: 'pointer',
  },
};

class NavBar extends Component {

  constructor(props){
    super(props);
    this.state = {
      authId: null
    }
  }

  componentDidMount() {
    const getUser = window.localStorage.getItem("user");
    let user = JSON.parse(getUser)

    if (user) {
      const authId = user.sub;
      this.setState({ authId: authId });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Key Vault Module
            </Typography>

            <IconButton className={classes.menuButton} color="inherit" title="Home" component={HomeLink}><HomeIcon /></IconButton>
            <IconButton className={classes.menuButton} color="inherit" title="Browse your keys" component={BrowseLink}><BrowseIcon /></IconButton>

            <LoggedInUser authId={this.state.authId}/>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
