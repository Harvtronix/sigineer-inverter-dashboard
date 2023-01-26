import './index.css'

import { ApolloProvider } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './app.js'

const GRAPHQL_HOST = 'http://localhost:4000/graphql'

const ReactWrapper = process.env.NODE_ENV === 'production' ? React.StrictMode : React.Fragment

const client = new ApolloClient({
  uri: GRAPHQL_HOST,
  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ReactWrapper>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </ReactWrapper>
)
