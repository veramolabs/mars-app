import React from 'react'
import Container from '@material-ui/core/Container'
import { useAgentList } from '../../agent'
import { Button, Grid, Typography, useMediaQuery } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import NewAgentModal from './../agent/dialogs/NewAgentDialog'
import { SerializedAgentConfig } from '../../agent/AgentListProvider'
import { useHistory } from 'react-router-dom'
import { useElectronDefaultConnection } from '../../electron/default-connection'

function OnboardingView() {
  const { addSerializedAgentConfig, setActiveAgentIndex } = useAgentList()
  const theme = useTheme()
  const history = useHistory()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [openNewAgentModal, setOpenNewAgentModal] = React.useState(false)
  const defaultConnection = useElectronDefaultConnection()
  const saveAgentConfig = (config: SerializedAgentConfig) => {
    addSerializedAgentConfig(config)
    setActiveAgentIndex(0)
    setOpenNewAgentModal(false)
    history.push('/agent/credentials')
  }

  const handleOpenNewAgentModal = () => {
    setOpenNewAgentModal(true)
  }

  const handleCloseNewAgentModal = () => {
    setOpenNewAgentModal(false)
  }

  const handleSaveLocalAgent = () => {
    if (defaultConnection) {
      addSerializedAgentConfig(defaultConnection)
    } else {
      addSerializedAgentConfig({
        name: 'Mars',
      })
    }
    setActiveAgentIndex(0)
    setOpenNewAgentModal(false)
    history.push('/agent/discover')
  }

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} justify="center">
        <Grid item xs={12}>
          <Typography variant="h4">Veramo Mars</Typography>
          <Typography variant="body1">Add your first agent:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Button variant="outlined" color="primary" onClick={handleSaveLocalAgent} fullWidth>
            Local
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="outlined" color="primary" onClick={handleOpenNewAgentModal} fullWidth>
            Cloud
          </Button>
        </Grid>
      </Grid>
      <NewAgentModal
        fullScreen={fullScreen}
        open={openNewAgentModal}
        onClose={handleCloseNewAgentModal}
        saveAgentConfig={saveAgentConfig}
      />
    </Container>
  )
}

export default OnboardingView
