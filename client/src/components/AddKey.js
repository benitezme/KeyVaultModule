import React, { Component } from 'react';
import {graphql, compose} from 'react-apollo';
import {getExchangesQuery, addKeyMutation, getKeysQuery} from '../queries/queries';

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
      validFrom: new Date(),
      validTo: new Date(),
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
          <option key={exchange.id} value={exchange.name}>{exchange.name}</option>
        )
      })
    }
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
        botId: this.state.botId
      },
      refetchQueries: [{query: getKeysQuery}]
    });
  }

  //TODO create keys types on schema, field Type
  render() {
    return (
      <form id="add-key" onSubmit={this.submitForm.bind(this)}>

        <div className="field">
          <label>Key:</label>
          <input type="text" onChange={(e)=>this.setState({key:e.target.value})}/>
        </div>

        <div className="field">
          <label>Secret:</label>
          <input type="password" onChange={(e)=>this.setState({secret:e.target.value})}/>
        </div>

        <div className="field">
          <label>Type:</label>
          <input type="text" onChange={(e)=>this.setState({type:e.target.value})}/>
        </div>

        <div className="field">
          <label>Description:</label>
          <input type="text" onChange={(e)=>this.setState({description:e.target.value})}/>
        </div>

        <div className="field">
          <label>Exchange:</label>
          <select onChange={(e)=>this.setState({exchangeId:e.target.value})}>
            <option>Select exchange</option>
            {this.displayExchanges()}
          </select>
        </div>

        <div className="field">
          <label>Valid From:</label>
          <input type="datetime-local" name="validFrom"  onChange={(e)=>this.setState({validFrom:e.target.value})}/>
        </div>

        <div className="field">
          <label>Valid To:</label>
          <input type="datetime-local" name="validTo" onChange={(e)=>this.setState({validTo:e.target.value})}/>
        </div>

        <div className="field">
          <label>Bot:</label>
          <select onChange={(e)=>this.setState({botId:e.target.value})}>
            <option>Select bot</option>
          </select>
        </div>

        <button>+</button>
      </form>

    );
  }
}

export default compose(
  graphql(getExchangesQuery,{name:'getExchangesQuery'}),
  graphql(addKeyMutation,{name:'addKeyMutation'})
)(AddKey);
