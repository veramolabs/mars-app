import React, { useEffect, useState } from "react";
import { List } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import AppBar from "../components/Nav/AppBar";
import { useAgent } from '../agent'
import { IIdentity } from "daf-core";
import Identity from '../components/Identity'

function ManagedIdentities(props: any) {
  const { agent } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ identities, setIdentities ] = useState<Array<IIdentity>>([])

  useEffect(() => {
    if (agent) {
      setLoading(true)
      agent.identityManagerGetIdentities()
      .then(setIdentities)
      .finally(() => setLoading(false))
    }
  }, [agent])

  return (
    <Container maxWidth="sm">
      <AppBar title='Managed identities' />  
      {loading && <LinearProgress />}
      <List >
        {identities.map(identity => (
          <Identity 
            key={identity.did} 
            did={identity.did} 
            type='summary'
          />
        ))}
      </List>
    </Container>
  )
}

export default ManagedIdentities;