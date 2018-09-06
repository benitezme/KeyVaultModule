import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';

//Components
import KeyList from './components/KeyList';
import AddKey from './components/AddKey';

//Apollo client setup

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="main">
          <h1>Key Vault Module</h1>
          <KeyList />
          <AddKey />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
