import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import CredentialCard from '../../components/cards/CredentialCard'
import AppBar from '../../components/nav/AppBar'
import { useAgent } from '../../agent'
import { useSnackbar } from 'notistack'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import MissingMethodsAlert from '../../components/nav/MissingMethodsAlert'
import { Alert, ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import ListIcon from '@material-ui/icons/List'
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda'

function CredentialsView(props: any) {
  const { agent } = useAgent()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState<Array<UniqueVerifiableCredential>>([])

  const [cardType, setCardType] = React.useState<'summary' | 'details'>('summary')

  useEffect(() => {
    setCredentials([])
    if (agent?.availableMethods().includes('dataStoreORMGetVerifiableCredentials')) {
      setLoading(true)
      agent
        .dataStoreORMGetVerifiableCredentials({
          order: [{ column: 'issuanceDate', direction: 'DESC' }],
        })
        .then(setCredentials)
        .finally(() => setLoading(false))
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    }
  }, [agent, enqueueSnackbar])

  return (
    <Container maxWidth="md">
      <AppBar
        title="Credentials"
        button={<ToggleButtonGroup
          value={cardType}
          exclusive
          size="small"
          onChange={(event, newCardType) => { setCardType(newCardType) }}
        >
          <ToggleButton value="summary">
            <ListIcon />
          </ToggleButton>
          <ToggleButton value="details">
            <ViewAgendaIcon />
          </ToggleButton>

        </ToggleButtonGroup>}
      />



      {loading && <LinearProgress />}
      <MissingMethodsAlert methods={['dataStoreORMGetVerifiableCredentials']} />
      {!loading && credentials.length === 0 && <Alert severity="success">There are no credentials</Alert>}
      <Grid container spacing={1} justify="center">
        {credentials.map((credential) => (
          <Grid
            item
            key={credential.hash}
            xs={12} //sm={6} md={4} lg={3} xl={2}
          >
            <CredentialCard credential={credential} type={cardType} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default CredentialsView
