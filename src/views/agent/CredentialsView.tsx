import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import CredentialCard from '../../components/cards/CredentialCard'
import AppBar from '../../components/nav/AppBar'
import { useAgent } from '../../agent'
import { useSnackbar } from 'notistack'
import { UniqueVerifiableCredential } from '@veramo/data-store'

function CredentialsView(props: any) {
  const { agent } = useAgent()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState<Array<UniqueVerifiableCredential>>([])

  useEffect(() => {
    if (agent) {
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
    <Container maxWidth="sm">
      <AppBar title="Credentials" />
      {loading && <LinearProgress />}
      <Grid container spacing={2} justify="center">
        {credentials.map((credential) => (
          <Grid
            item
            key={credential.hash}
            xs={12} //sm={6} md={4} lg={3} xl={2}
          >
            <CredentialCard credential={credential} type="summary" />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default CredentialsView
