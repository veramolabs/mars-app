import React, { useState } from 'react'
import Container from '@material-ui/core/Container'
import AppBar from '../../components/nav/AppBar'
import { useAgent } from '../../agent'
import { Card, CardContent, Grid, LinearProgress, Typography } from '@material-ui/core'
import { DIDDocument } from 'daf-core'
import { useSnackbar } from 'notistack'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}))

function ResolverView() {
  const { enqueueSnackbar } = useSnackbar()
  const { agent } = useAgent()
  const [loading, setLoading] = useState(false)
  const [didUrl, setDidUrl] = useState<string>('')
  const [didDoc, setDidDoc] = useState<DIDDocument | undefined>(undefined)
  const classes = useStyles()
  const handleResolve = () => {
    if (agent) {
      setLoading(true)
      agent
        .resolveDid({ didUrl })
        .then(setDidDoc)
        .finally(() => setLoading(false))
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    }
  }

  return (
    <Container maxWidth="sm">
      <AppBar title="Discover" />
      <Grid container spacing={2} justify="center">
        <Grid item xs={12}>
          <Paper
            component="form"
            className={classes.root}
            onSubmit={(e) => {
              e.preventDefault()
              handleResolve()
            }}
          >
            <InputBase
              className={classes.input}
              value={didUrl}
              onChange={(e) => setDidUrl(e.target.value)}
              placeholder="Enter DID"
            />
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
              onClick={handleResolve}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>

        {loading && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

        {didDoc && (
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="textPrimary">
                  <pre>{JSON.stringify(didDoc, null, 2)}</pre>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default ResolverView
