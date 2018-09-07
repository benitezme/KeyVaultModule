import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';

import { Route, BrowserRouter, Switch } from 'react-router-dom';

//Components
import ButtonAppBar from './components/Material-UI/ButtonAppBar'
import Home from './components/Home'
import Keys from './components/Keys'
import Browse from './components/Browse'
// import Search from './components/Search'
// import About from './components/About'
// import Contact from './components/Contact'
// import Post from './components/Post'
// import Footer from './components/Footer'



//Apollo client setup

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <ApolloProvider client={client}>
          <div className="main">
            <ButtonAppBar/>
            <Switch>
              <Route exact path='/' component={Home}/>
              <Route path='/keys' component={Keys} />
              <Route path='/browse' component={Browse} />
              {/* <Route path='/search' component={Search} />
              <Route path='/about' component={About} />
              <Route path='/contact' component={Contact} />
              <Route path='/:post_id' component={Post} /> */}
            </Switch>
          </div>
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}

export default App;
