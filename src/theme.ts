import { createMuiTheme } from '@material-ui/core/styles'
import deepOrange from '@material-ui/core/colors/deepOrange'
import indigo from '@material-ui/core/colors/indigo'

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: deepOrange,
    secondary: indigo,
  },
  shape: {
    borderRadius: 10,
  },
})

export default theme
