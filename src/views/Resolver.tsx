import React, { useState } from "react";
import Container from '@material-ui/core/Container';
import AppBar from "../components/Nav/AppBar";
import { useAgent } from '../agent'
import { Button, Card, CardActions, CardContent, Grid, LinearProgress, makeStyles, TextField, Typography } from "@material-ui/core";
import { DIDDocument } from 'daf-core'
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

function Resolver(props: any) {
  const classes = useStyles();
  const { agent } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ didUrl, setDidUrl ] = useState<string>('')
  const [ didDoc, setDidDoc ] = useState<DIDDocument | undefined>(undefined)

  const handleResolve = () => {
    if (agent) {
      setLoading(true)
      agent.resolveDid({ didUrl })
      .then(setDidDoc)
      .finally(()=>setLoading(false))
    }
  }


  return (
    <Container maxWidth="sm">
      <AppBar title='Resolver' />
      <Grid container spacing={2} justify="center">
          <Grid item xs={12}>
            <Card>
            <CardContent>

            <TextField
              label="DID Url"
              type="text"
              value={didUrl}
              onChange={(e) => setDidUrl(e.target.value)}
              fullWidth
              />
            </CardContent>
            <CardActions>

            <Button
              color="primary" 
              onClick={handleResolve}
              >Resolve DID Document</Button>
              </CardActions>
          {loading && <LinearProgress />}
          
          </Card>
          </Grid>


          {didDoc && <Grid item xs={12} >
            <Card variant="outlined">
              <CardContent>
                <Typography variant='body2' color='textPrimary'>
                  <pre>
                    {JSON.stringify(didDoc,null,2)}
                  </pre>
                </Typography>
              </CardContent>
            </Card>
          </Grid>}
      </Grid>
    </Container>
  );
}

export default Resolver;