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
          <table className="key-tables">
            <tbody>
              <tr>
                <td>Key</td>
                <td>{key.key}</td>
              </tr>
              <tr>
                <td>Type</td>
                <td>{key.type}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>{key.description}</td>
              </tr>
              <tr>
                <td>Exchange</td>
                <td>{key.exchange}</td>
              </tr>
              <tr>
                <td>Valid From</td>
                <td>{key.validFrom}</td>
              </tr>
              <tr>
                <td>Valid To</td>
                <td>{key.validTo}</td>
              </tr>
              <tr>
                <td>Active</td>
                <td>{key.active.toString()}</td>
              </tr>
              <tr>
                <td>Boot id</td>
                <td>{key.botId}</td>
              </tr>
            </tbody>
          </table>
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
        {/* <KeyDetails keyId={this.state.selected}/> */}
      </div>
    );
  }
}

export default graphql(getKeysQuery)(KeyList);
