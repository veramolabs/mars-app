import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import CredentialCard from '../../components/cards/CredentialCard'
import AppBar from '../../components/nav/AppBar'
import { useAgent } from '../../agent'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import { Grid, Typography } from '@material-ui/core'
import { VerifiableCredential } from '@veramo/core'
import { useSnackbar } from 'notistack'

function CredentialView(props: any) {
  const { hash } = useParams<{ hash: string }>()
  const { enqueueSnackbar } = useSnackbar()
  const { agent } = useAgent()
  const [loading, setLoading] = useState(false)
  const [credential, setCredential] = useState<VerifiableCredential | undefined>(undefined)
  const [credentials, setCredentials] = useState<Array<UniqueVerifiableCredential>>([])
  useEffect(() => {
    if (agent) {
      setLoading(true)
      agent
        .dataStoreGetVerifiableCredential({ hash })
        .then(setCredential)
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    }
  }, [agent, hash, enqueueSnackbar])

  useEffect(() => {
    if (agent && credential) {
      agent
        .dataStoreORMGetVerifiableCredentials({
          where: [
            {
              column: 'subject',
              value: [credential?.credentialSubject.id || ''],
            },
          ],
        })
        .then((c) => c.filter((i) => i.hash !== hash))
        .then(setCredentials)
        .finally(() => setLoading(false))
    }
  }, [agent, credential, hash])

  return (
    <Container maxWidth="sm">
      <AppBar title="Verifiable credential" />
      {loading && <LinearProgress />}
      {credential && (
        <Grid container spacing={2} justify="center">
          <Grid item xs={12}>
            <CredentialCard credential={{ hash, verifiableCredential: credential }} type="details" />
          </Grid>

          <Grid item xs={12} style={{ padding: 8, marginTop: 8, overflowWrap: 'anywhere' }}>
            {credentials.length > 0 && (
              <Typography variant="body2">Known credentials issued to the same subject:</Typography>
            )}
            {credentials.length === 0 && (
              <Typography variant="body2">
                There are no known credentials issued to the same subject:
              </Typography>
            )}
            <Typography variant="caption" color="textSecondary">
              {credential.credentialSubject.id}
            </Typography>
          </Grid>

          {credentials.map((credential) => (
            <Grid item key={credential.hash} xs={12}>
              <CredentialCard credential={credential} type="summary" />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default CredentialView
