import React, { Component } from 'react'
import { Route, BrowserRouter, Switch } from 'react-router-dom'

// Components
import { BrowseKeys, AddKey, AuditLogList } from './views/keys'
import Home from './views/home'
import NavBar from './views/nav'


class App extends Component {

  render () {
    const { match } = this.props

    return (
      <BrowserRouter>
        <div className='App'>
          <NavBar match={match} />

          <Switch>
            <Route exact path={`${match.path}`} component={Home} />
            <Route
              exact
              path={`${match.path}/key-vault`}
              render={props => <Home {...props} />}
            />
            <Route
              exact
              path={`${match.path}/browse`}
              render={props => <BrowseKeys {...props} />}
            />
            <Route
              exact
              path={`${match.path}/addKey`}
              render={props => <AddKey {...props} />}
            />
            <BrowseKeys />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

export default App
