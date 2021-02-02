import React, { useEffect, useState } from 'react'
import { List, makeStyles, Tab, Tabs } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import AppBar from '../../components/nav/AppBar'
import { useVeramo } from '@veramo-community/veramo-react'
import { IIdentifier } from '@veramo/core'
import IdentityListItemLink from '../../components/nav/IdentityListItemLink'
import { useSnackbar } from 'notistack'

import MissingMethodsAlert from '../../components/nav/MissingMethodsAlert'

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(6),
  },
}))

function IdentitiesView(props: any) {
  const { agent } = useVeramo()
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [identities, setIdentities] = useState<Array<Partial<IIdentifier>>>([])
  const [didCount, setDidCount] = useState<number>(0)
  const [otherCount, setOtherCount] = useState<number>(0)
  const [tab, setTab] = React.useState(0)

  useEffect(() => {
    if (agent?.availableMethods().includes('dataStoreORMGetIdentifiers')) {
      setLoading(true)
      setIdentities([])
      agent
        .dataStoreORMGetIdentifiers({
          where: [
            { column: 'did', value: ['did%'], op: 'Like', not: tab === 1 },
            { column: 'provider', value: [], op: 'IsNull' },
          ],
        })
        .then(setIdentities)
        .finally(() => setLoading(false))
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    }
  }, [agent, tab, enqueueSnackbar])


  useEffect(() => {
    setDidCount(0)
    if (agent?.availableMethods().includes('dataStoreORMGetIdentifiersCount')) {
      agent.dataStoreORMGetIdentifiersCount({
        where: [
          { column: 'did', value: ['did%'], op: 'Like' },
          { column: 'provider', value: [], op: 'IsNull' },
        ],
      })
        .then(setDidCount)
    }
  }, [agent, enqueueSnackbar])

  useEffect(() => {
    setOtherCount(0)
    if (agent?.availableMethods().includes('dataStoreORMGetIdentifiersCount')) {
      agent.dataStoreORMGetIdentifiersCount({
        where: [
          { column: 'did', value: ['did%'], op: 'Like', not: true },
          { column: 'provider', value: [], op: 'IsNull' },
        ],
      })
        .then(setOtherCount)
    }
  }, [agent, enqueueSnackbar])

  return (
    <Container maxWidth="md" className={classes.container}>
      <AppBar title="Known identifiers">
        <Tabs
          value={tab}
          onChange={(event: any, newValue: any) => {
            setTab(newValue)
          }}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`DID (${didCount})`}/>
          <Tab label={`Other (${otherCount})`}/>
        </Tabs>
      </AppBar>
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
