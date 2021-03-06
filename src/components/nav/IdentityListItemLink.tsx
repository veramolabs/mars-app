import React, { useState, useEffect } from 'react'
import { CircularProgress, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import { IdentityProfile } from '../../types'
import { useAgent } from '../../agent'
import { useIdModal } from './IdentifierModalProvider'

interface Props {
  did: string
  type: 'summary' | 'details'
}

function IdentityListItemLink(props: Props) {
  const { did } = props
  const { agent } = useAgent()
  const [loading, setLoading] = useState(false)
  const [identity, setIdentity] = useState<IdentityProfile>({ did, name: did })
  const { showDid } = useIdModal()
  
  useEffect(() => {
    if (did) {
      setLoading(true)
      agent
        .getIdentityProfile({ did })
        .then(setIdentity)
        .finally(() => setLoading(false))
    }
  }, [agent, did])

  return (
    <ListItem dense divider button onClick={() => showDid(did)}>
      <ListItemAvatar>
      {loading ? <CircularProgress /> : <Avatar src={identity.picture} />}
        
      </ListItemAvatar>
      <ListItemText primary={identity.name} secondary={identity.nickname} />
    </ListItem>
  )
}

export default IdentityListItemLink
