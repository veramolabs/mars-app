import React, { useState, useEffect } from "react"
import { LinearProgress, ListItemAvatar, ListItemText } from "@material-ui/core"
import Avatar from '@material-ui/core/Avatar'
import { IdentityProfile } from "../types";
import { useAgent } from '../agent'
import ListItemLink from "./Nav/ListItemLink"
import Box from "@material-ui/core/Box/Box";

interface Props {
  did?: string
  type: 'summary' | 'details'
}

function Identity(props: Props) {
  const { did } = props
  const { agent, getIdentityProfile } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ identity, setIdentity ] = useState<IdentityProfile|undefined>(undefined)

  useEffect(() => {
    if (did) {
      setLoading(true)
      getIdentityProfile(did)
      .then(setIdentity)
      .finally(() => setLoading(false))
    }
  }, [agent, getIdentityProfile, did])

  if (loading) {
    return (<LinearProgress />)
  } else if (identity) {    
    return (
      <ListItemLink to={'/identity/'+ identity.did}>
        <ListItemAvatar>
          <Avatar src={identity.picture} />
        </ListItemAvatar>
      <ListItemText 
        primary={identity.name}
        secondary={identity.nickname} 
        />
    </ListItemLink>);
  } else {
    return <Box />
  }
}

export default Identity;