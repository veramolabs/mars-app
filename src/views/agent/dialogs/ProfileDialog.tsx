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
  TextField,
  Avatar,
  FormControl,
  InputLabel,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  LinearProgress,
  ListSubheader,
} from '@material-ui/core'
import { IdentityProfile } from '../../../types'
import shortId from 'shortid'
import { AgentConfig } from '../../../agent/AgentListProvider'

interface Props {
  fullScreen: boolean
  open: boolean
  onClose: any
  subject?: string
}

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    // width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
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
  subject: {
    marginBottom: theme.spacing(2),
  },
}))

interface AgentWithManagedDids {
  agentConfig: AgentConfig
  profiles: IdentityProfile[]
}

function ProfileDialog(props: Props) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { agentList, activeAgentIndex } = useAgentList()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState<string | undefined>('')
  const [nickname, setNickname] = useState<string | undefined>('')
  const [picture, setPicture] = useState<string | undefined>('')
  const [issuer, setIssuer] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const [issuers, setIssuers] = useState<AgentWithManagedDids[]>([])
  const [knownIdentifiers, setKnownIdentifiers] = useState<AgentWithManagedDids[]>([])

  useEffect(() => {
    setLoading(true)

    const getAllManagedIdentifiers = async (): Promise<AgentWithManagedDids[]> => {
      const result: AgentWithManagedDids[] = []
      for (const agentConfig of agentList) {
        if (agentConfig.agent.availableMethods().includes('identityManagerGetIdentities')) {
          const identities = await agentConfig.agent.identityManagerGetIdentities()
          const profiles = await Promise.all(
            identities.map(({ did }) => agentConfig.agent.getIdentityProfile({ did })),
          )
          result.push({
            agentConfig,
            profiles,
          })
        }
      }
      return result
    }

    getAllManagedIdentifiers()
      .then(setIssuers)
      .finally(() => setLoading(false))
  }, [agentList])

  useEffect(() => {
    setLoading(true)

    const getAllKnownIdentifiers = async (): Promise<AgentWithManagedDids[]> => {
      const result: AgentWithManagedDids[] = []
      for (const agentConfig of agentList) {
        if (agentConfig.agent.availableMethods().includes('dataStoreORMGetIdentities')) {
          const identities = await agentConfig.agent.dataStoreORMGetIdentities({
            where: [{ column: 'did', value: ['did%'], op: 'Like' }],
          })
          const profiles = await Promise.all(
            identities.map(({ did }) => agentConfig.agent.getIdentityProfile({ did })),
          )
          result.push({
            agentConfig,
            profiles,
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
    if (props.subject) {
      setSubject(activeAgentIndex + '|' + props.subject)
    }
  }, [agentList, activeAgentIndex, props.subject])

  useEffect(() => {
    setLoading(true)
    if (subject) {
      agentList[activeAgentIndex].agent
        .getIdentityProfile({ did: subject.split('|')[1] })
        .then((profile) => {
          setName(profile.name || '')
          setNickname(profile.nickname || '')
          setPicture(profile.picture || '')
        })
        .finally(() => setLoading(false))
    }
  }, [agentList, activeAgentIndex, subject])

  const saveProfileInfo = async () => {
    if (!issuer || !subject) throw Error('Issuer not set')
    try {
      const credentialSubject = {
        id: props.subject,
      } as {
        id: string
        name?: string
        nickname?: string
        picture?: string
      }
      credentialSubject['id'] = subject.split('|')[1]
      if (name) credentialSubject['name'] = name
      if (nickname) credentialSubject['nickname'] = nickname
      if (picture) credentialSubject['picture'] = picture
      const uniqId = shortId.generate()

      const split = issuer.split('|')

      await agentList[parseInt(split[0], 10)].agent.createVerifiableCredential({
        credential: {
          issuer: { id: split[1] },
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'Profile'],
          issuanceDate: new Date().toISOString(),
          id: uniqId,
          credentialSubject,
        },
        save: true,
        proofFormat: 'jwt',
      })
      enqueueSnackbar('Profile credential created', { variant: 'success' })
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
      <DialogTitle id="responsive-dialog-title">Issue contact information credential</DialogTitle>
      {loading && <LinearProgress />}
      <DialogContent>
        <form className={classes.form}>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel id="demo-simple-select-label">Issuer</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={issuer}
              onChange={(event) => setIssuer(event.target.value as string)}
              SelectDisplayProps={SelectDisplayProps}
            >
              {issuers.map((agentWithDids, index) => [
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
            <InputLabel id="demo-simple-select-label">Subject</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={subject}
              onChange={(event) => setSubject(event.target.value as string)}
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

          <TextField
            variant="outlined"
            label="Picture"
            type="text"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
            margin="normal"
            fullWidth
          />

          <TextField
            variant="outlined"
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            fullWidth
          />

          <TextField
            variant="outlined"
            label="Nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            margin="normal"
            fullWidth
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose} color="default">
          Cancel
        </Button>
        <Button onClick={saveProfileInfo} color="primary" autoFocus>
          Issue
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProfileDialog
