import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
  TextField,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Collapse,
  Typography,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import IconButton from '@material-ui/core/IconButton'
import { SerializedAgentConfig } from '../../../agent/AgentListProvider'
import { useSnackbar } from 'notistack'
import clsx from 'clsx'
interface Props {
  fullScreen: boolean
  open: boolean
  onClose: any
  schemaUrl?: string
  saveAgentConfig: (config: SerializedAgentConfig) => void
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    flex: 1,
  },
  expand: {
    transform: 'rotate(0deg)',
    // marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}))

function NewAgentDialog(props: Props) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [schemaUrl, setSchemaUrl] = useState<string>('')
  const [validSchema, setValidSchema] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [apiUrl, setApiUrl] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [schema, setSchema] = useState<any>()
  const [enabledMethods, setEnabledMethods] = useState<string[]>([])
  const [availableMethods, setAvailableMethods] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)

  const handleChange = (event: any) => {
    if (event.target.checked) {
      setEnabledMethods(enabledMethods.concat([event.target.name]))
    } else {
      setEnabledMethods(enabledMethods.filter((m) => m !== event.target.name))
    }
  }

  useEffect(() => {
    if (props.schemaUrl) {
      setSchemaUrl(props.schemaUrl)
    }
  },[props.schemaUrl])

  useEffect(() => {
    if (schemaUrl && schemaUrl !== '') {
      setLoading(true)
      fetch(schemaUrl)
        .then((res) => res.json())
        .then((schema) => {
          setSchema(schema)
          setApiUrl(schema.servers[0].url)
          setName(schema.info.title)
          const methods = []
          for (const path of Object.keys(schema.paths)) {
            methods.push(schema.paths[path].post.operationId)
          }
          setAvailableMethods(methods)
          setEnabledMethods(methods)
          setValidSchema(true)
        })
        .catch((e) => {
          enqueueSnackbar(e.message, { variant: 'error' })
          setValidSchema(false)
          setSchema(undefined)
          setApiUrl('')
        })
        .finally(() => setLoading(false))
    }
  }, [schemaUrl, enqueueSnackbar])

  const configureAgent = () => {
    props.saveAgentConfig({
      name,
      schema: {
        components: {
          schemas: schema.components.schemas,
          methods: schema['x-methods'],
        },
      },
      apiUrl,
      token,
      enabledMethods,
    })
  }

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Dialog
      fullScreen={props.fullScreen}
      open={props.open}
      onClose={props.onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Add Cloud Agent</DialogTitle>
      <DialogContent>
        <TextField
          label="Schema URL"
          margin="normal"
          type="text"
          variant="outlined"
          error={!loading && schemaUrl !== '' && !validSchema}
          helperText={!loading && schemaUrl !== '' && !validSchema ? 'Invalid schema' : ''}
          value={schemaUrl}
          onChange={(e) => setSchemaUrl(e.target.value)}
          fullWidth
        />

        {validSchema && (
          <Box>
            <TextField
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              variant="outlined"
              fullWidth
            />

            {schema?.servers?.length > 1 && (
              <FormControl component="fieldset">
                <FormLabel component="legend">Agent URL</FormLabel>
                <RadioGroup
                  aria-label="apiUrl"
                  name="apiUrl"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                >
                  {schema.servers.map((server: any) => (
                    <FormControlLabel
                      key={server.url}
                      value={server.url}
                      control={<Radio />}
                      label={server.url}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {schema.security?.length > 0 && (
              <TextField
                label="Token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                margin="normal"
                variant="outlined"
                fullWidth
              />
            )}

              <Box display='flex' flexDirection='row' flex={1} justifyContent='space-between' alignItems='center'>
                <Typography variant="body1" color='textSecondary'>Enabled methods ({enabledMethods.length} / {availableMethods.length})</Typography>
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded,
                  })}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
            <FormControl component="fieldset" className={classes.formControl}>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
              <FormGroup>
                {availableMethods.map((method) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={enabledMethods.includes(method)}
                        onChange={handleChange}
                        name={method}
                      />
                    }
                    key={method}
                    label={method}
                  />
                ))}
              </FormGroup>
              </Collapse>
            </FormControl>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose} color="default">
          Cancel
        </Button>
        <Button onClick={configureAgent} color="primary" autoFocus disabled={!validSchema}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewAgentDialog
