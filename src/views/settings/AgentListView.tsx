import React from "react";
import Container from '@material-ui/core/Container';
import AppBar from "../../components/nav/AppBar";
import { useAgentList } from '../../agent'
import { Box, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

function AgentListView(props: any) {
  const { agentList, removeAgent } = useAgentList()

  return (
    <Container maxWidth="sm">
      <AppBar title='Cloud agents' />
      <Grid container spacing={2} justify="center">
          <Grid item xs={12}>
          <List
            subheader={
              agentList.length > 0 
              ? <ListSubheader component="div" id="nested-list-subheader">
                Cloud Agents
              </ListSubheader>
              : <Box/>
            }
          >
            {agentList.map((item, index) => (
              <ListItem 
                role={undefined} dense 
                key={index} 
                >
                <ListItemText 
                  primary={item.name} 
                  secondary={`${item.apiUrl}, methods: ${item.agent.availableMethods().length}`} 
                  />
                <ListItemSecondaryAction onClick={() => removeAgent(index)}>
                  <IconButton edge="end" aria-label="Delete">
                    <DeleteIcon />
                  </IconButton>
              </ListItemSecondaryAction>
              </ListItem>

            ))}
          </List>
          </Grid>
      </Grid>
    </Container>
  );
}

export default AgentListView;