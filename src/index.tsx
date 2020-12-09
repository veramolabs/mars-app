import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom' 
import App from './App';
import theme from './theme';
import MobileProvider from './components/Nav/MobileProvider';
import { AgentListProvider } from './agent/AgentListProvider';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AgentListProvider>
        <MobileProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </MobileProvider>
      </AgentListProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
