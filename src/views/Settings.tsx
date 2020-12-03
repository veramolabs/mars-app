import React, { useState } from "react";
import Container from '@material-ui/core/Container';
import AppBar from "../components/Nav/AppBar";
import { useAgent } from '../agent'
import { Button, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, makeStyles, TextField } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import { AgentConnection } from "../types";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

function Settings(props: any) {
  const classes = useStyles();

  const { 
    setConnection,
    connection,
    connections,
    setConnections
  } = useAgent()

  const [ url, setUrl ] = useState<string>('')
  const [ token, setToken ] = useState<string>('')

  const handleAddConnection = () => {
    const connection = { url, token }
    setConnections([...connections, connection])
    setConnection(connection)
  }

  const handleDeleteConnection = (item: AgentConnection) => {
    const filtered = connections.filter(c => c.url !== item.url && c.token !== item.token)
    if (connection?.url === item.url && connection.token === item.token) {
      setConnection(filtered[0])
    }
    setConnections(filtered)
  }

  return (
    <Container maxWidth="sm">
      {connection && <AppBar title='Settings' />}
      <Grid container spacing={2} justify="center">
          <Grid item xs={12}>
          <List
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Cloud Agents
              </ListSubheader>
            }
          >
            {connections.map(item => (
              <ListItem 
                role={undefined} dense button onClick={() => setConnection(item)}
                key={item.token} 
                selected={item.url === connection?.url && item.token === connection?.token }>
                <ListItemText primary={item.url} />
                <ListItemSecondaryAction onClick={() => handleDeleteConnection(item)}>
                  <IconButton edge="end" aria-label="Delete">
                    <DeleteIcon />
                  </IconButton>
              </ListItemSecondaryAction>
              </ListItem>

            ))}
          </List>
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={classes.margin}
              label="Cloud Agent URL"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
            />
            <TextField
              className={classes.margin}
              label="Token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              fullWidth
            />
            <Button
              className={classes.margin}
              color="primary" 
              variant="contained"
              onClick={handleAddConnection}
            >Add Cloud Agent</Button>
          </Grid>
      </Grid>
    </Container>
  );
}

export default Settings;