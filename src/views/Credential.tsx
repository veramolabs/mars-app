import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import CredentialCard from "../components/CredentialCard";
import AppBar from "../components/Nav/AppBar";
import { useAgent } from '../agent'
import { UniqueVerifiableCredential } from 'daf-typeorm'
import { Grid } from "@material-ui/core";


function Credential(props: any) {
  const { id } = useParams<{ id: string }>()
  const { agent } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ credentials, setCredentials ] = useState<Array<UniqueVerifiableCredential>>([])
  useEffect(() => {
    if (agent) {
      setLoading(true)
      agent.dataStoreORMGetVerifiableCredentials({      
        where: [ { column: 'id', value: [process.env.REACT_APP_HOST + '/c/' + id]}]
      })
      .then(setCredentials)
      .finally(() => setLoading(false))
    }
  }, [agent, id])

  return (
    <Container maxWidth="sm">
      <AppBar/>
      {loading && <LinearProgress />}
      <Grid container spacing={2} justify="center">
        {credentials.map(credential => (
          <Grid item key={credential.hash} xs={12}>
            <CredentialCard credential={credential.verifiableCredential} type='details' />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Credential;