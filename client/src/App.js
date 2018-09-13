import React, { Component } from 'react'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'

import { Route, BrowserRouter, Switch } from 'react-router-dom'

// Components
import Auth from './auth/index'
import Home from './views/Home'
import { Callback, Logout } from './views/auth'
import { NavBar } from './views/nav'
import { BrowseKeys } from './views/keys'

// Apollo client setup
const httpLink = new HttpLink({ uri: 'http://localhost:4002/graphql', changeOrigin: true })

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )
  }
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('access_token')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ``
    }
  }
})

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache()
})

export const auth = new Auth(result => console.log('auth result', result), client)

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <ApolloProvider client={client}>
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
        </ApolloProvider>
      </BrowserRouter>
    )
  }
}

export default App
