import React from 'react'
import Container from '@material-ui/core/Container'
import AppBar from '../../components/nav/AppBar'
import { useAgentList } from '../../agent'
import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

function AgentListView(props: any) {
  const { agentList, removeAgent } = useAgentList()

  return (
    <Container maxWidth="sm">
      <AppBar title="Agents" />
      <Grid container spacing={2} justify="center">
        <Grid item xs={12}>
          <List>
            {agentList.map((item, index) => (
              <ListItem role={undefined} dense key={index}>
                <ListItemText
                  primary={item.name}
                  secondary={`${item.apiUrl || ''} ${item.apiUrl ? '|' : ''} ${
                    item.agent.availableMethods().length
                  } methods`}
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
  )
}

export default AgentListView
