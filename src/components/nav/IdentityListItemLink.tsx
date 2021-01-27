import React from 'react'
import { useQuery } from 'react-query'
import { CircularProgress, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import { IdentityProfile } from '../../types'
import { useAgent, useAgentList } from '../../agent'
import { useIdModal } from './IdentifierModalProvider'

interface Props {
  did: string
  type: 'summary' | 'details'
}

function IdentityListItemLink(props: Props) {
  const { did } = props
  const { agent } = useAgent()
  const { activeAgentIndex } = useAgentList()
  const { showDid } = useIdModal()

  const { isLoading, data } = useQuery<IdentityProfile, Error>({
    queryKey: ['profile', activeAgentIndex, did],
    queryFn: () => agent.getIdentityProfile({ did }),
    initialData: { did, name: did },
  })

  return (
    <ListItem dense divider button onClick={() => showDid(did)}>
      <ListItemAvatar>{isLoading ? <CircularProgress /> : <Avatar src={data?.picture} />}</ListItemAvatar>
      <ListItemText primary={data?.name} secondary={data?.nickname} />
    </ListItem>
  )
}

export default IdentityListItemLink
