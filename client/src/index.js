import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import LuxonUtils from 'material-ui-pickers/utils/luxon-utils'

import { BrowseKeys, AddKey, AuditLogList } from './views/keys'
import Home from './views/home'

const App = () => (
  <MuiPickersUtilsProvider utils={LuxonUtils}>
    <Switch>
      <Route exact path='/key-vault/' component={Home} />
      <Route path='/key-vault/browse' component={BrowseKeys} />
      <Route path='/key-vault/addKey' component={AddKey} />
    </Switch>
  </MuiPickersUtilsProvider>
)

export default App
