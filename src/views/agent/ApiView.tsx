import React from 'react'
import { List, ListItem, ListItemText, useMediaQuery, useTheme } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import { useAgent } from '../../agent'
import AppBar from '../../components/nav/AppBar'
import MethodDialog from './dialogs/MethodDialog'

function ApiView() {
  const { agent } = useAgent()
  const [openMethodModal, setOpenMethodModal] = React.useState(false)
  const [method, setMethod] = React.useState('')
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  const handleOpenMethodModal = (methodName: string) => {
    setMethod(methodName)
    setOpenMethodModal(true)
  }

  const handleCloseMethodModal = () => {
    setOpenMethodModal(false)
  }

  const schema = agent.getSchema()

  return (
    <Container maxWidth="sm">
      <AppBar title="API" />
      <List>
        {Object.keys(schema.components.methods).map((method) => (
          <ListItem
            button
            divider
            key={method}
            disabled={!agent.availableMethods().includes(method)}
            onClick={() => handleOpenMethodModal(method)}
          >
            <ListItemText primary={method} secondary={schema.components.methods[method].description} />
          </ListItem>
        ))}
      </List>
      <MethodDialog
        fullScreen={fullScreen}
        open={openMethodModal}
        method={method}
        onClose={handleCloseMethodModal}
      />
    </Container>
  )
}

export default ApiView
