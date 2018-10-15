import React, { Component } from 'react'
import { Route, BrowserRouter, Switch } from 'react-router-dom'

// Components
import Home from './views/Home'
import { BrowseKeys } from './views/keys'

class App extends Component {

  render () {
    return (
      <BrowserRouter basename={window.location.pathname}>
        <Switch>
          {/* <Route path='/' component={Home} />
          <Route path='/browse' component={BrowseKeys} /> */}
          <Route path='/' component={BrowseKeys} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App
