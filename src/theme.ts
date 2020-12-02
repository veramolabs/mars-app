import { createMuiTheme } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';
import green from '@material-ui/core/colors/green';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: deepOrange,
    secondary: green,
  },
  shape: {
    borderRadius: 10
  }
  
});

export default theme;