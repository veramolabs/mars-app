import React, { useCallback, useState } from 'react'
import Container from '@material-ui/core/Container'
import AppBar from '../../components/nav/AppBar'
import { useAgent } from '../../agent'
import { Card, CardContent, Grid, LinearProgress, TextField } from '@material-ui/core'
import { DIDDocument } from '@veramo/core'
import { useSnackbar } from 'notistack'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import MissingMethodsAlert from '../../components/nav/MissingMethodsAlert'
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

  const handleResolve = useCallback(() => {
    if(agent.availableMethods().includes('resolveDid')) {
      setLoading(true)
      agent
      .resolveDid({ didUrl })
      .then(setDidDoc)
      .finally(() => setLoading(false))
      .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    } else {
      setDidDoc(undefined)
    }
  }, [agent, didUrl, enqueueSnackbar])

  return (
    <Container maxWidth="sm">
      <AppBar title="Discover" />
      <MissingMethodsAlert methods={['resolveDid']} />

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
            <IconButton type="submit" className={classes.iconButton} aria-label="search">
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
                <TextField
                  label="DID Document"
                  multiline
                  rows={30}
                  value={JSON.stringify(didDoc, null, 2)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  inputProps={{ style: { fontFamily: 'monospace' } }}
                />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default ResolverView
