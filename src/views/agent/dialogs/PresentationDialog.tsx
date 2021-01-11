import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import { useAgentList } from '../../../agent'
// import { useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
  Avatar,
  FormControl,
  InputLabel,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  LinearProgress,
  ListSubheader,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
} from '@material-ui/core'
import { IdentityProfile } from '../../../types'
import shortId from 'shortid'
import { AgentConfig } from '../../../agent/AgentListProvider'
import { usePresentation } from '../../../components/nav/PresentationProvider'
import CredentialCard from '../../../components/cards/CredentialCard'

interface Props {
  fullScreen: boolean
  open: boolean
  onClose: any
  verifier?: string
}

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    // width: 'fit-content',
  },
  formControl: {
    marginBottom: theme.spacing(2),
    minWidth: 120,
  },
  select: {
    height: '48px',
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginTop: theme.spacing(2),
    height: 30,
    width: 30,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  verifier: {
    marginBottom: theme.spacing(2),
  },
  credentialsLabel: {
    marginBottom: theme.spacing(1),
  },
}))

interface AgentWithManagedDids {
  agentConfig: AgentConfig
  profiles: IdentityProfile[]
}

function PresentationDialog(props: Props) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { agentList, activeAgentIndex } = useAgentList()
  const [loading, setLoading] = useState(false)
  const [send, setSend] = useState(false)
  const [holder, setHolder] = useState<string>('')
  const [verifier, setVerifier] = useState<string>('')
  const [holders, setHolders] = useState<AgentWithManagedDids[]>([])
  const [knownIdentifiers, setKnownIdentifiers] = useState<AgentWithManagedDids[]>([])
  const [savePresentationInAgents, setSavePresentationInAgents] = useState<number[]>([activeAgentIndex])
  const presentation = usePresentation()

  const handleChange = (event: any) => {
    const val = parseInt(event.target.value, 10)
    if (event.target.checked) {
      setSavePresentationInAgents(savePresentationInAgents.concat([val]))
    } else {
      setSavePresentationInAgents(savePresentationInAgents.filter((m) => m !== val))
    }
  }


  useEffect(() => {
    setLoading(true)

    const getAllManagedIdentifiers = async (): Promise<AgentWithManagedDids[]> => {
      const result: AgentWithManagedDids[] = []
      for (const agentConfig of agentList) {
        if (agentConfig.agent.availableMethods().includes('didManagerFind')) {
          const identities = await agentConfig.agent.didManagerFind()
          const profiles = await Promise.all(
            identities.map(({ did }) => agentConfig.agent.getIdentityProfile({ did })),
          )
          result.push({
            agentConfig,
            profiles,
          })
        } else {
          result.push({
            agentConfig,
            profiles: [],
          })
        }
      }
      return result
    }

    getAllManagedIdentifiers()
      .then(setHolders)
      .finally(() => setLoading(false))
  }, [agentList])

  useEffect(() => {
    setLoading(true)

    const getAllKnownIdentifiers = async (): Promise<AgentWithManagedDids[]> => {
      const result: AgentWithManagedDids[] = []
      for (const agentConfig of agentList) {
        if (agentConfig.agent.availableMethods().includes('dataStoreORMGetIdentifiers')) {
          const identities = await agentConfig.agent.dataStoreORMGetIdentifiers({
            where: [{ column: 'did', value: ['did%'], op: 'Like' }],
          })
          const profiles = await Promise.all(
            identities.map(({ did }) => agentConfig.agent.getIdentityProfile({ did })),
          )
          result.push({
            agentConfig,
            profiles,
          })
        } else {

          result.push({
            agentConfig,
            profiles: [],
          })
        }
      }
      return result
    }

    getAllKnownIdentifiers()
      .then(setKnownIdentifiers)
      .finally(() => setLoading(false))
  }, [agentList])

  useEffect(() => {
    setLoading(true)
    if (props.verifier) {
      setVerifier(activeAgentIndex + '|' + props.verifier)
    }
  }, [agentList, activeAgentIndex, props.verifier])

  useEffect(() => {
    setLoading(true)
    if (verifier) {
      agentList[activeAgentIndex].agent
        .getIdentityProfile({ did: verifier.split('|')[1] })
        .then((profile) => {
          //FIXME
        })
        .finally(() => setLoading(false))
    }
  }, [agentList, activeAgentIndex, verifier])

  const createPresentation = async () => {
    if (!holder || !verifier) throw Error('Holder not set')
    try {

      const uniqId = shortId.generate()

      const [agentIndex, holderDid] = holder.split('|')
      const verifierDid = verifier.split('|')[1]
      const holderAgentIndex = parseInt(agentIndex, 10)

      const verifiablePresentation = await agentList[holderAgentIndex].agent.createVerifiablePresentation({
        presentation: {
          holder: holderDid ,
          verifier: [verifierDid],
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: uniqId,
          verifiableCredential: presentation.credentials.map(i => i.verifiableCredential),
        },
        proofFormat: 'jwt',
      })
      enqueueSnackbar('Presentation created', { variant: 'success' })

      for (const index of savePresentationInAgents) {
        await agentList[index].agent.dataStoreSaveVerifiablePresentation({ verifiablePresentation })
        enqueueSnackbar('Presentation saved to ' + agentList[index].name, { variant: 'success' })
      }

      if (send) {
        await agentList[holderAgentIndex].agent.sendMessageDIDCommAlpha1({
          data: {
            from: holderDid,
            to: verifierDid,
            body: verifiablePresentation.proof.jwt,
            type: 'jwt'
          },
          save: true
        })
        enqueueSnackbar('Message sent', { variant: 'success' })
      }
      presentation.reset()

      props.onClose()
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }
  const SelectDisplayProps = {
    style: {
      display: 'flex',
      alignItems: 'center',
      height: 50,
    },
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
      <DialogTitle id="responsive-dialog-title">Share credentials</DialogTitle>
      {loading && <LinearProgress />}
      <DialogContent>
        <form className={classes.form}>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel id="demo-simple-select-label">Holder</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={holder}
              onChange={(event) => setHolder(event.target.value as string)}
              SelectDisplayProps={SelectDisplayProps}
            >
              {holders.map((agentWithDids, index) => [
                <ListSubheader key={agentWithDids.agentConfig.name}>
                  {agentWithDids.agentConfig.name}
                </ListSubheader>,

                agentWithDids.profiles.map((identity) => (
                  <MenuItem value={index + '|' + identity.did} key={index + '|' + identity.did}>
                    <ListItemAvatar>
                      <Avatar src={identity.picture} />
                    </ListItemAvatar>
                    <ListItemText primary={identity.name} secondary={identity.nickname} />
                  </MenuItem>
                )),
              ])}
            </Select>
          </FormControl>

          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel id="demo-simple-select-label">Verifier</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={verifier}
              onChange={(event) => setVerifier(event.target.value as string)}
              SelectDisplayProps={SelectDisplayProps}
            >
              {knownIdentifiers.map((agentWithDids, index) => [
                <ListSubheader key={agentWithDids.agentConfig.name}>
                  {agentWithDids.agentConfig.name}
                </ListSubheader>,

                agentWithDids.profiles.map((identity) => (
                  <MenuItem value={index + '|' + identity.did} key={index + '|' + identity.did}>
                    <ListItemAvatar>
                      <Avatar src={identity.picture} />
                    </ListItemAvatar>
                    <ListItemText primary={identity.name} secondary={identity.nickname} />
                  </MenuItem>
                )),
              ])}
            </Select>
          </FormControl>
          
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend" className={classes.credentialsLabel}>Credentials</FormLabel>
          <Grid container spacing={2}>
            {presentation.credentials.map(c => <Grid item key={c.hash} xs={12}>
              <CredentialCard credential={c} type='details' />
            </Grid>)}  
          </Grid>
          </FormControl>

          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Save to:</FormLabel>
            <FormGroup>
              {agentList.map((agent, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={savePresentationInAgents.includes(index)}
                      disabled={!agent.agent.availableMethods().includes('dataStoreSaveVerifiableCredential')}
                      onChange={handleChange}
                      value={index}
                    />
                  }
                  key={index}
                  label={agent.name}
                />
              ))}
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Send as a message:</FormLabel>
            <FormGroup>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={send}
                      onChange={(e, checked) => setSend(checked) }
                      value={true}
                    />
                  }

                  label={'From holder to verifier'}
                />

            </FormGroup>
          </FormControl>

        </form>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose} color="default">
          Cancel
        </Button>
        <Button onClick={createPresentation} color="primary" autoFocus
          disabled={(savePresentationInAgents.length === 0 && !send) || presentation.credentials.length === 0}
        >
          Create presentation
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PresentationDialog
