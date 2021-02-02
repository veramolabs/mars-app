import React, { useState, useEffect } from 'react'
import { Grid, makeStyles, Typography, Box } from '@material-ui/core'
import LinearProgress from '@material-ui/core/LinearProgress'
import CredentialCard from '../../../components/cards/CredentialCard'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import { useVeramo } from '@veramo-community/veramo-react'
import { useSnackbar } from 'notistack'
import MissingMethodsAlert from '../../../components/nav/MissingMethodsAlert'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'

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

  },
}))

function IdentifierCredentialsView(props: { did: string }) {
  const { did } = props
  const classes = useStyles()
  const { agent } = useVeramo()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState<Array<UniqueVerifiableCredential>>([])
  const [tab, setTab] = React.useState(0)

  const [issuerCredentialCount, setIssuerCredentialCount] = useState<number>(0)
  const [subjectCredentialCount, setSubjectCredentialCount] = useState<number>(0)


  useEffect(() => {
    setIssuerCredentialCount(0)
    if (agent?.availableMethods().includes('dataStoreORMGetVerifiableCredentialsCount')) {
      agent.dataStoreORMGetVerifiableCredentialsCount({
        where: [{ column: 'issuer', value: [did] }],
      })
        .then(setIssuerCredentialCount)
    }
  }, [agent, did, enqueueSnackbar])


  useEffect(() => {
    setSubjectCredentialCount(0)
    if (agent?.availableMethods().includes('dataStoreORMGetVerifiableCredentialsCount')) {
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
      setCredentials([])
      agent
        .dataStoreORMGetVerifiableCredentials({
          where: [{ column: tab === 0 ? 'subject' : 'issuer', value: [did] }],
        })
        .then(setCredentials)
        .finally(() => setLoading(false))
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    }
  }, [agent, enqueueSnackbar, tab, did])

  return (
    <Grid container spacing={2} className={classes.container}>
      {loading && <LinearProgress />}
      <MissingMethodsAlert methods={['dataStoreORMGetVerifiableCredentials']} />

      {did.substr(0, 3) === 'did' && <Box margin={1} >
        <ToggleButtonGroup
          value={tab}
          size='small'
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value={0}>
            <Typography variant='caption'>{`Subject (${subjectCredentialCount})`} </Typography>
          </ToggleButton>
          <ToggleButton value={1}>
            <Typography variant='caption'>{`Issuer (${issuerCredentialCount})`} </Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>}

      {credentials.map((credential) => (
        <Grid item key={credential.hash} xs={12}>
          <CredentialCard credential={credential} type="details" />
        </Grid>
      ))}
    </Grid>
  )
}

export default IdentifierCredentialsView
