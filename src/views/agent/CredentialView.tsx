import React, { useEffect, useState } from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import CredentialCard from '../../components/cards/CredentialCard'
import { useAgent } from '../../agent'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import { Box, Grid, Typography } from '@material-ui/core'
import { VerifiableCredential } from '@veramo/core'
import { useSnackbar } from 'notistack'
import MissingMethodsAlert from '../../components/nav/MissingMethodsAlert'

function CredentialView(props: { hash: string }) {
  const { hash } = props
  const { enqueueSnackbar } = useSnackbar()
  const { agent } = useAgent()
  const [loading, setLoading] = useState(false)
  const [credential, setCredential] = useState<VerifiableCredential | undefined>(undefined)
  const [credentials, setCredentials] = useState<Array<UniqueVerifiableCredential>>([])
  useEffect(() => {
    if (agent?.availableMethods().includes('dataStoreGetVerifiableCredential')) {
      setLoading(true)
      agent
        .dataStoreGetVerifiableCredential({ hash })
        .then(setCredential)
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    } else {
      setCredential(undefined)
    }
  }, [agent, hash, enqueueSnackbar])

  useEffect(() => {
    if (agent?.availableMethods().includes('dataStoreORMGetVerifiableCredentials') && credential) {
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
    } else {
      setCredentials([])
    }
  }, [agent, credential, hash])

  return (
    <Box>
      {loading && <LinearProgress />}
      <MissingMethodsAlert methods={['dataStoreORMGetVerifiableCredentials', 'dataStoreGetVerifiableCredential']} />

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
              <CredentialCard credential={credential} type="details" />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default CredentialView
