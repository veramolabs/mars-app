import React, { useState, useEffect } from 'react'
import { Grid, makeStyles, Tabs, Tab } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import CredentialCard from '../../components/cards/CredentialCard'
import AppBar from '../../components/nav/AppBar'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import { useAgent } from '../../agent'
import { IdentityProfile } from '../../types'
import { useSnackbar } from 'notistack'
import CredentialFAB from '../../components/nav/CredentialFAB'
import MissingMethodsAlert from '../../components/nav/MissingMethodsAlert'

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 150,
    height: 150,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  collapse: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },

  container: {
    paddingTop: theme.spacing(6),
  },
}))

function IdentityView() {
  const { did: rawDid } = useParams<{ did: string }>()
  const did = decodeURIComponent(rawDid)
  const classes = useStyles()
  const { agent } = useAgent()
  const { enqueueSnackbar } = useSnackbar()
  const [identity, setIdentity] = useState<IdentityProfile | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState<Array<UniqueVerifiableCredential>>([])

  const [tab, setTab] = React.useState(did.substr(0, 3) === 'did' ? 0 : 1)

  const handleChange = (event: any, newValue: any) => {
    setTab(newValue)
  }

  useEffect(() => {
    agent.getIdentityProfile({ did }).then(setIdentity)
  }, [agent, did])

  useEffect(() => {
    if (agent?.availableMethods().includes('dataStoreORMGetVerifiableCredentials')) {
      setLoading(true)
      agent
        .dataStoreORMGetVerifiableCredentials({
          where: [{ column: tab === 0 ? 'issuer' : 'subject', value: [did] }],
        })
        .then(setCredentials)
        .finally(() => setLoading(false))
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    } else {
      setCredentials([])
    }
  }, [agent, enqueueSnackbar, tab, did])

  return (
    <Container maxWidth="sm">
      <AppBar
        title={identity?.name || ''}
        avatar={<Avatar src={identity?.picture} />}
        primary={identity?.name}
        secondary={identity?.nickname}
      >
        {did.substr(0, 3) === 'did' && (
          <Tabs value={tab} onChange={handleChange} indicatorColor="primary" textColor="primary">
            <Tab label="Issuer" />
            <Tab label="Subject" />
          </Tabs>
        )}
      </AppBar>
      {identity && <CredentialFAB subject={identity.did} />}
      {loading && <LinearProgress />}
      <MissingMethodsAlert methods={['dataStoreORMGetVerifiableCredentials']} />

      <Grid container spacing={2} justify="center" className={classes.container}>
        {credentials.map((credential) => (
          <Grid item key={credential.hash} xs={12}>
            <CredentialCard credential={credential} type="summary" />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default IdentityView
