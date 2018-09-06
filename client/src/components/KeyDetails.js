import React, { Component } from 'react';
import {graphql} from 'react-apollo';
import {getBookQuery} from '../queries/queries';

class KeyDetails extends Component {
  displayKeyDetails(){
    const {key} = this.props.data;
    if(key){
      return(
        <div>
          <p>Key: {key.key}</p>
          <p>Type: {key.type}</p>
          <p>Description: {key.description}</p>
          <p>Exchange: {key.exchange}</p>
          <p>Valid From: {key.validFrom}</p>
          <p>Valid To: {key.validTo}</p>
          <p>Active: {key.active.toString()}</p>
          <p>Boot id: {key.botId}</p>
        </div>
      )
    }else{
      return (
        <div>No book selected</div>
      )
    }
  }

  render() {
    return (
      <div id="key-details">
        {this.displayKeyDetails()}
      </div>
    );
  }
}

export default graphql(getBookQuery,{
  options:(props) => {
    return{
      variables:{
        id:props.keyId
      }
    }
  }
})(KeyDetails);
