import React, { Component } from 'react';
import {auth} from '../App';
import { getItem } from '../utils/local-storage'
import LoggedInUserMenu from './LoggedInUserMenu'
// import {getUserByAuthIdQuery} from '../queries/queries';

class LoggedInUser extends Component {

  state = {
      user: null,
    };

  displayLoggedInUser(){
    let user= this.state.user;
    console.log('Logged in User: '+JSON.stringify(user));

    if(user){
      let displayName = "No Display Name";

      if (user.nickname !== null && user.nickname !== "") {
        displayName =  user.nickname;
      }

      return(
          <div>
              <p><LoggedInUserMenu menuLabel={ displayName }/></p>
          </div>
      );

    } else {
        return( <div onClick={() => auth.login()}>Login / Sign up</div> );
    }

  }

  componentDidMount() {
    this._asyncRequest = getItem('user').then(
      user => {
        this._asyncRequest = null;
        this.setState({user:JSON.parse(user)});
      }
    );
  }

  render() {
    return (
      <div>
        {this.displayLoggedInUser()}
      </div>
    );
  }
}

export default LoggedInUser; // This binds the querty to the component
