import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import Amplify from 'aws-amplify'
import { config } from '../src/services/config'

const queryClient = new QueryClient()

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    userPoolWebClientId: config.APP_CLIENT_ID,
    identityPoolId: config.IDENTITY_POOL_ID,
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
})

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>,
  document.getElementById('root')
)
