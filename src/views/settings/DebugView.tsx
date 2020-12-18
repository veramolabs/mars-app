import React, { useState } from 'react'
import Container from '@material-ui/core/Container'
import AppBar from '../../components/nav/AppBar'
import { Grid, TextField, Typography } from '@material-ui/core'
import debug from 'debug'

function DebugView() {
  const [namespace, setNamespace] = useState(localStorage.debug)

  const handleNamespaceChange = (s: string) => {
    debug.enable(s)
    setNamespace(s)
  }

  return (
    <Container maxWidth="sm">
      <AppBar title="Debug" />
      <Grid container spacing={2} justify="center">
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            label="Scope"
            type="text"
            value={namespace}
            onChange={(e) => handleNamespaceChange(e.target.value)}
            margin="normal"
            fullWidth
          />

          <Typography variant="body1">Examples</Typography>
          <Typography variant="body2" color="textPrimary">
            * - show all debug info in console
          </Typography>
          <Typography variant="body2" color="textPrimary">
            veramo:agent:getIdentityProfile - show only specific name space
          </Typography>
        </Grid>
      </Grid>
    </Container>
  )
}

export default DebugView
