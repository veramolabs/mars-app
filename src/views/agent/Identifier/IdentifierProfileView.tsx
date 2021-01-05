import React, { useState, useEffect } from 'react'
import { Grid, makeStyles, List, ListItemText, ListItemAvatar } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import LinearProgress from '@material-ui/core/LinearProgress'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import { useAgent } from '../../../agent'
import { useSnackbar } from 'notistack'
import MissingMethodsAlert from '../../../components/nav/MissingMethodsAlert'
import ListItemLink from '../../../components/nav/ListItemLink'
import { useCredentialModal } from '../../../components/nav/CredentialModalProvider'

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

interface ProfileItem {
  type: string
  value: string
  credential: UniqueVerifiableCredential
}

function IdentifierProfileView() {
  const { did: rawDid } = useParams<{ did: string }>()
  const did = decodeURIComponent(rawDid)
  const classes = useStyles()
  const { agent } = useAgent()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [profileItems, setProfileItems] = useState<Array<ProfileItem>>([])
  const { showCredential } = useCredentialModal()

  const generateProfileItems = (credentials: UniqueVerifiableCredential[]): ProfileItem[] => {
    const items: ProfileItem[] = []
    const all: Record<string,ProfileItem> = {}

    credentials.forEach(credential => {
      const { credentialSubject } = credential.verifiableCredential
      for (const type of Object.keys(credentialSubject)) {
        const value = credentialSubject[type]
        all[type] = { type, value, credential } 
      }
    })

    for (const type of Object.keys(all)) {
      items.push(all[type])
    }
    return items
  }

  useEffect(() => {
    setProfileItems([])
    if (agent?.availableMethods().includes('dataStoreORMGetVerifiableCredentials')) {
      setLoading(true)
      agent
        .dataStoreORMGetVerifiableCredentials({
          where: [
            { column: 'subject', value: [did] },
            { column: 'type', value: ['VerifiableCredential,Profile'] }
          ],

        })
        .then(generateProfileItems)
        .then(setProfileItems)
        .finally(() => setLoading(false))
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    }
  }, [agent, enqueueSnackbar, did])

  return (
    <Grid container spacing={2} justify="space-evenly" className={classes.container}>
      {loading && <LinearProgress />}
      <MissingMethodsAlert methods={['dataStoreORMGetVerifiableCredentials']} />
      <List>
        {profileItems.map((item) => (
          <ListItemLink key={item.type} onClick={() => showCredential(item.credential.hash)}>
            {item.type === 'picture' && <ListItemAvatar>
              <Avatar src={item.value} />
            </ListItemAvatar>}

            <ListItemText
              primary={item.type}
              secondary={item.type !== 'picture' && item.value}
            />
          </ListItemLink>
        ))}
      </List>
    </Grid>
  )
}

export default IdentifierProfileView
