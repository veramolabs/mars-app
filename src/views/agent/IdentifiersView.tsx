import React, { useEffect, useState } from "react";
import { List } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import AppBar from "../../components/Nav/AppBar";
import { useAgent } from '../../agent'
import { IIdentity } from "daf-core";
import Identity from '../../components/Identity'

function IdentitiesView(props: any) {
  const { agent } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ identities, setIdentities ] = useState<Array<Partial<IIdentity>>>([])

  useEffect(() => {
    if (agent) {
      setLoading(true)
      agent.dataStoreORMGetIdentities()
      .then(setIdentities)
      .finally(() => setLoading(false))
    }
  }, [agent])

  return (
    <Container maxWidth="sm">
      <AppBar title='Known identifiers' />
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

export default IdentitiesView;