import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import CredentialCard from '../components/CredentialCard'
import AppBar from "../components/Nav/AppBar";
import { useAgent } from '../agent'
import { UniqueVerifiableCredential } from 'daf-typeorm'

function Credentials(props: any) {
  const { agent } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ credentials, setCredentials ] = useState<Array<UniqueVerifiableCredential>>([])

  useEffect(() => {
    if (agent) {
      setLoading(true)
      agent.dataStoreORMGetVerifiableCredentials({
        order: [
          { column: 'issuanceDate', direction: 'DESC' }
        ]
      })
      .then(setCredentials)
      .finally(() => setLoading(false))
    }
  }, [agent])
  
  return (
    <Container maxWidth="sm">
      <AppBar title='Credentials' />
      {loading && <LinearProgress />}
      <Grid container spacing={2} justify="center">
        {credentials.map(credential => (
          <Grid item key={credential.hash} xs={12}>
            <CredentialCard credential={credential.verifiableCredential} type={'summary'}/>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Credentials;