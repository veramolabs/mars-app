import React, { useEffect, useState } from 'react'
import { List, makeStyles, Tab, Tabs } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import AppBar from '../../components/nav/AppBar'
import { useAgent } from '../../agent'
import { IIdentity } from 'daf-core'
import IdentityListItemLink from '../../components/nav/IdentityListItemLink'
import { useSnackbar } from 'notistack'

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
  const [identities, setIdentities] = useState<Array<Partial<IIdentity>>>([])
  const [tab, setTab] = React.useState(0)

  useEffect(() => {
    if (agent) {
      setLoading(true)
      agent
        .dataStoreORMGetIdentities({
          where: [{ column: 'did', value: [tab === 0 ? 'did%' : 'http%'], op: 'Like' }],
        })
        .then(setIdentities)
        .finally(() => setLoading(false))
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
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
      {loading && <LinearProgress />}
      <List>
        {identities.map((identity) => (
          <IdentityListItemLink key={identity.did} did={identity.did as string} type="summary" />
        ))}
      </List>
    </Container>
  )
}

export default IdentitiesView
