import React from 'react'
import Container from '@material-ui/core/Container'
import AppBar from '../../components/nav/AppBar'
import { useVeramo } from '@veramo-community/veramo-react'
import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

function AgentListView(props: any) {
  const { agents, removeAgent } = useVeramo()

  return (
    <Container maxWidth="sm">
      <AppBar title="Agents" />
      <Grid container spacing={2} justify="center">
        <Grid item xs={12}>
          <List>
            {agents.map((agent) => (
              <ListItem role={undefined} dense key={agent.context.id}>
                <ListItemText
                  primary={agent.context?.name}
                  secondary={`${agent.availableMethods().length} methods`}
                />
                <ListItemSecondaryAction onClick={() => removeAgent(agent.context?.id as string)}>
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
