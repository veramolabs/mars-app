import React, { useEffect, useState } from 'react'
import { List } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useAgent } from '../../agent'
import { IIdentity } from 'daf-core'
import AppBar from '../../components/nav/AppBar'
import IdentityListItemLink from '../../components/nav/IdentityListItemLink'
import { useSnackbar } from 'notistack'

function ManagedIdentities(props: any) {
  const { agent } = useAgent()
  const [loading, setLoading] = useState(false)
  const [identities, setIdentities] = useState<Array<IIdentity>>([])
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (agent) {
      setLoading(true)
      agent
        .identityManagerGetIdentities()
        .then(setIdentities)
        .finally(() => setLoading(false))
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    }
  }, [agent, enqueueSnackbar])

  return (
    <Container maxWidth="sm">
      <AppBar title="Managed identities" />
      {loading && <LinearProgress />}
      <List>
        {identities.map((identity) => (
          <IdentityListItemLink key={identity.did} did={identity.did} type="summary" />
        ))}
      </List>
    </Container>
  )
}

export default ManagedIdentities
