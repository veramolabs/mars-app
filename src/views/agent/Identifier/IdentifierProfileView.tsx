import React, { useState, useEffect } from 'react'
import { makeStyles, List, ListItemText, Box, ListItem } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import LinearProgress from '@material-ui/core/LinearProgress'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import { useAgent } from '../../../agent'
import { useSnackbar } from 'notistack'
import MissingMethodsAlert from '../../../components/nav/MissingMethodsAlert'
import ListItemLink from '../../../components/nav/ListItemLink'
import { useCredentialModal } from '../../../components/nav/CredentialModalProvider'
import ProfileCredentialButton from '../../../components/nav/ProfileCredentialButton'

const useStyles = makeStyles(() => ({
  avatar: {
    width: 100,
    height: 100,
  },
}))

interface ProfileItem {
  type: string
  value: string
  credential: UniqueVerifiableCredential
}

function IdentifierProfileView(props: { did: string }) {
  const { did } = props
  const classes = useStyles()
  const { agent } = useAgent()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [profileItems, setProfileItems] = useState<Array<ProfileItem>>([])
  const { showCredential } = useCredentialModal()

  const generateProfileItems = (credentials: UniqueVerifiableCredential[]): ProfileItem[] => {
    const items: ProfileItem[] = []
    const all: Record<string, ProfileItem> = {}

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

  const filteredItems = profileItems.filter(i => i.type !== 'picture' && i.type !== 'id')
  return (
    <Box>
      {loading && <LinearProgress />}
      <MissingMethodsAlert methods={['dataStoreORMGetVerifiableCredentials']} />
        <Box flexDirection='row' display='flex'>
          <Box>
            {profileItems.filter(i => i.type === 'picture').map((item) => (
              <ListItemLink key={item.type} onClick={() => showCredential(item.credential.hash)}>
                <Avatar src={item.value} className={classes.avatar} variant='rounded'/>
              </ListItemLink>
            ))}
          </Box>
          <List style={{ flex: 1 }}>
            {filteredItems.map((item, key) => (
              <ListItem
                button
                divider={key < filteredItems.length - 1}
                dense key={item.type} onClick={() => showCredential(item.credential.hash)}>
                <ListItemText
                  primary={item.value}
                  secondary={item.type}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <ProfileCredentialButton subject={did}/>

    </Box>
  )
}

export default IdentifierProfileView
