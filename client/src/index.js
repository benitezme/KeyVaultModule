import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import LuxonUtils from 'material-ui-pickers/utils/luxon-utils'
import { BrowseKeys, AddKey } from './views/keys'
import Home from './views/home'

const App = () => (
  <MuiPickersUtilsProvider utils={LuxonUtils}>
    <Switch>
      <Route exact path='/keys/' component={Home} />
      <Route path='/keys/browse' component={BrowseKeys} />
      <Route path='/keys/addKey' component={AddKey} />
    </Switch>
  </MuiPickersUtilsProvider>
)

export default App
