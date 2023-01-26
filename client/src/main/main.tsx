import './index.css'

import { ApolloProvider } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import React from 'react'
import ReactDOM from 'react-dom/client'

import DefaultView from './views/default-view'

const GRAPHQL_HOST =
  process.env.NODE_ENV === 'production' ? '/graphql' : 'http://localhost:3000/graphql'

const ReactWrapper = process.env.NODE_ENV === 'production' ? React.StrictMode : React.Fragment

const client = new ApolloClient({
  uri: GRAPHQL_HOST,
  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ReactWrapper>
    <ApolloProvider client={client}>
      <DefaultView />
    </ApolloProvider>
  </ReactWrapper>
)
