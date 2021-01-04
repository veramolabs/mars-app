import React, { useState, useEffect } from 'react'
import { Grid, makeStyles, Tabs, Tab } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import LinearProgress from '@material-ui/core/LinearProgress'
import CredentialCard from '../../../components/cards/CredentialCard'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import { useAgent } from '../../../agent'
import { useSnackbar } from 'notistack'
import MissingMethodsAlert from '../../../components/nav/MissingMethodsAlert'

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

function IdentifierCredentialsView() {
  const { did: rawDid } = useParams<{ did: string }>()
  const did = decodeURIComponent(rawDid)
  const classes = useStyles()
  const { agent } = useAgent()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState<Array<UniqueVerifiableCredential>>([])
  const [tab, setTab] = React.useState(did.substr(0, 3) === 'did' ? 0 : 1)

  const [issuerCredentialCount, setIssuerCredentialCount] = useState<number>(0)
  const [subjectCredentialCount, setSubjectCredentialCount] = useState<number>(0)


  useEffect(() => {
    setIssuerCredentialCount(0)
    if (agent.availableMethods().includes('dataStoreORMGetVerifiableCredentialsCount')) {
      agent.dataStoreORMGetVerifiableCredentialsCount({
        where: [{ column: 'issuer', value: [did] }],
      })
        .then(setIssuerCredentialCount)
    }
  }, [agent, did, enqueueSnackbar])


  useEffect(() => {
    setSubjectCredentialCount(0)
    if (agent.availableMethods().includes('dataStoreORMGetVerifiableCredentialsCount')) {
      agent.dataStoreORMGetVerifiableCredentialsCount({
        where: [{ column: 'subject', value: [did] }],
      })
        .then(setSubjectCredentialCount)
    }
  }, [agent, did, enqueueSnackbar])

  const handleChange = (event: any, newValue: any) => {
    setTab(newValue)
  }

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
    <Grid container spacing={2} justify="center" className={classes.container}>
      {loading && <LinearProgress />}
      <MissingMethodsAlert methods={['dataStoreORMGetVerifiableCredentials']} />

      {did.substr(0, 3) === 'did' && (
        <Tabs value={tab} onChange={handleChange} indicatorColor="primary" textColor="primary">
          <Tab label={`Issuer (${issuerCredentialCount})`} />
          <Tab label={`Subject (${subjectCredentialCount})`} />
        </Tabs>
      )}

      {credentials.map((credential) => (
        <Grid item key={credential.hash} xs={12}>
          <CredentialCard credential={credential} type="summary" />
        </Grid>
      ))}
    </Grid>
  )
}

export default IdentifierCredentialsView
