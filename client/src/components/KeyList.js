import React, { Component } from 'react';
import {graphql} from 'react-apollo';
import {getKeysQuery} from '../queries/queries';

//components
import KeyDetails from './KeyDetails';

class KeyList extends Component {
  constructor(props){
    super(props);
    this.state={
      selected:''
    }
  }

  displayKeys(){
    var data = this.props.data;
    if(data.loading){
      return <div>Loading keys...</div>;
    }else{
      return data.keys.map(key => {
        return (
          <li key={key.id} onClick={(e)=>{this.setState({selected: key.id})}}>{key.key}</li>
        )
      })
    }
  }

  render() {
    return (
      <div>
        <ul id="key-list">
          {this.displayKeys()}
        </ul>
        <KeyDetails keyId={this.state.selected}/>
      </div>
    );
  }
}

export default graphql(getKeysQuery)(KeyList);
