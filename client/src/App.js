import React, { Component } from 'react'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { ApolloLink, Observable } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'

import { Route, BrowserRouter, Switch } from 'react-router-dom'

// Material UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import { getItem } from './utils/local-storage'

// Components
import Auth from './auth/index'
import Home from './views/Home'
import { Callback, Logout } from './views/auth'
import { NavBar, Footer } from './views/nav'
import { BrowseKeys } from './views/keys'

// Apollo client setup

let graphqlEndpoint ='http://localhost:4002/graphql'
// let graphqlEndpoint ='https://keyvault-api.advancedalgos.net/graphql'
const httpUserLink = new HttpLink({ uri: 'https://users-api.advancedalgos.net/graphql' })

const httpLink = new HttpLink({ uri: graphqlEndpoint })

const authRetryLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      // User access token has expired
      // console.log('authLink: ', graphQLErrors) // check for error message to intercept and resend with Auth0 access token
      if (graphQLErrors[0].message === 'Not logged in') {
        // We assume we have auth0 access token needed to run the async request
        // Let's refresh token through async request
        return new Observable(observer => {
          getItem('access_token')
            .then(accessToken => {
              operation.setContext(({ headers = {} }) => ({
                headers: {
                  // Re-add old headers
                  ...headers,
                  // Switch out old access token for new one
                  Authorization: `Bearer ${accessToken}` || null
                }
              }))
            })
            .then(() => {
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer)
              }

              // Retry last failed request
              forward(operation).subscribe(subscriber)
            })
            .catch(error => {
              // No auth0 access token available, we force user to login
              observer.error(error)
            })
        })
      }
    }
  }
)

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  await getItem('access_token').then(token => {
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : ``
      }
    }
  })
})

export const client = new ApolloClient({
  link: ApolloLink.from([authRetryLink, authLink, httpLink]),
  cache: new InMemoryCache()
})

export const userClient = new ApolloClient({
  link: ApolloLink.from([authRetryLink, authLink, httpUserLink]),
  cache: new InMemoryCache()
})

export const auth = new Auth(
  result => console.log('auth result', result),
  client
)

/* Here we change the default Material UI theme for Advanced Algos brand colors. */

const theme = createMuiTheme({
  palette: {
    primary: { main: '#303036' }, // DARK.
    secondary: { main: '#CC5835' } // RUSTED_RED.
  }
})

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <ApolloProvider client={client}>
          <MuiThemeProvider theme={theme}>
            <div className='App'>
            <NavBar auth={auth} />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/browse' component={BrowseKeys} />
              <Route path='/logout' component={Logout} />
              <Route path='/callback' render={(props) => {
                auth.handleAuthentication(props)
                return <Callback {...props} />
              }} />
            </Switch>
            <Footer />
            </div>
          </MuiThemeProvider>
        </ApolloProvider>
      </BrowserRouter>
    )
  }
}

export default App
