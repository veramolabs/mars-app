import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SnackbarProvider } from 'notistack'
import App from './App'

import theme from './theme'
import MobileProvider from './components/nav/MobileProvider'
import { AgentModalProvider } from './components/nav/AgentModalProvider'
import { VeramoProvider } from '@veramo-community/veramo-react'
import { IdentityProfileManager } from './agent/ProfileManager'

const plugins = [
  new IdentityProfileManager()
]
const queryClient = new QueryClient()
ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SnackbarProvider
          maxSnack={4}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <MobileProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <VeramoProvider plugins={plugins}>
                <AgentModalProvider>
                  <App />
                </AgentModalProvider>
              </VeramoProvider>
            </ThemeProvider>
          </MobileProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
