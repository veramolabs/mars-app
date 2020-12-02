import React from "react";
import Container from '@material-ui/core/Container';
import AppBar from "../components/Nav/AppBar";
import { useAgent } from '../agent'
import { Grid, TextField } from "@material-ui/core";

function Settings(props: any) {
  const { apiKey, url, setApiKey, setUrl } = useAgent()

  return (
    <Container maxWidth="sm">
      <AppBar title='Settings' />
      <Grid container spacing={2} justify="center">
          <Grid item xs={12}>
            <TextField
              id="url"
              label="Cloud Agent URL"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
            />
            <TextField
              id="apiKey"
              label="API Key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              fullWidth
            />
          </Grid>
      </Grid>
    </Container>
  );
}

export default Settings;