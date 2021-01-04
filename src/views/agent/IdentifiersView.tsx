import React, { useEffect, useState } from 'react'
import { List, makeStyles, Tab, Tabs } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import AppBar from '../../components/nav/AppBar'
import { useAgent } from '../../agent'
import { IIdentifier } from '@veramo/core'
import IdentityListItemLink from '../../components/nav/IdentityListItemLink'
import { useSnackbar } from 'notistack'
import CredentialFAB from '../../components/nav/CredentialFAB'
import MissingMethodsAlert from '../../components/nav/MissingMethodsAlert'

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(6),
  },
}))

function IdentitiesView(props: any) {
  const { agent } = useAgent()
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [identities, setIdentities] = useState<Array<Partial<IIdentifier>>>([])
  const [tab, setTab] = React.useState(0)

  useEffect(() => {
    if (agent?.availableMethods().includes('dataStoreORMGetIdentifiers')) {
      setLoading(true)
      agent
        .dataStoreORMGetIdentifiers({
          where: [{ column: 'did', value: [tab === 0 ? 'did%' : 'http%'], op: 'Like' }],
        })
        .then(setIdentities)
        .finally(() => setLoading(false))
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    } else {
      setIdentities([])
    }
  }, [agent, tab, enqueueSnackbar])

  return (
    <Container maxWidth="sm" className={classes.container}>
      <AppBar title="Known identifiers">
        <Tabs
          value={tab}
          onChange={(event: any, newValue: any) => {
            setTab(newValue)
          }}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="DID" />
          <Tab label="HTTP" />
        </Tabs>
      </AppBar>
      <CredentialFAB />
      {loading && <LinearProgress />}
      <MissingMethodsAlert methods={['dataStoreORMGetIdentifiers']} />

      <List>
        {identities.map((identity) => (
          <IdentityListItemLink key={identity.did} did={identity.did as string} type="summary" />
        ))}
      </List>
    </Container>
  )
}

export default IdentitiesView
