import React, { Component } from 'react'
import { Route, BrowserRouter, Switch } from 'react-router-dom'

// Components
import { BrowseKeys } from './views/keys'

class App extends Component {

  render () {
    return (
      <BrowseKeys />
    )
  }
}

export default App
