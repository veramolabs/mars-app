import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import { useAgent } from '../../../agent'
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
  ListItem,
  LinearProgress,
  Paper,
} from '@material-ui/core'
import { IdentityProfile } from '../../../types'
import shortId from 'shortid'

interface Props {
  fullScreen: boolean
  open: boolean
  onClose: any
  subject: string
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

function ProfileDialog(props: Props) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { agent } = useAgent()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState<string | undefined>('')
  const [nickname, setNickname] = useState<string | undefined>('')
  const [picture, setPicture] = useState<string | undefined>('')
  const [issuer, setIssuer] = useState<string | undefined>(undefined)
  const [subject, setSubject] = useState<IdentityProfile | undefined>(undefined)
  const [identities, setIdentities] = useState<IdentityProfile[]>([])

  useEffect(() => {
    setLoading(true)
    agent
      .identityManagerGetIdentities()
      .then((identities) => Promise.all(identities.map(({ did }) => agent.getIdentityProfile({ did }))))
      .then((profiles) => {
        if (profiles.length > 0) {
          setIssuer(profiles[0].did)
        }
        return profiles
      })
      .then(setIdentities)
      .finally(() => setLoading(false))
  }, [agent])

  useEffect(() => {
    setLoading(true)
    agent
      .getIdentityProfile({ did: props.subject })
      .then((profile) => {
        setName(profile.name || '')
        setNickname(profile.nickname || '')
        setPicture(profile.picture || '')
        return profile
      })
      .then(setSubject)
      .finally(() => setLoading(false))
  }, [agent, props.subject])

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
      credentialSubject['id'] = subject?.did
      if (name) credentialSubject['name'] = name
      if (nickname) credentialSubject['nickname'] = nickname
      if (picture) credentialSubject['picture'] = picture
      const uniqId = shortId.generate()
      await agent.createVerifiableCredential({
        credential: {
          issuer: { id: issuer },
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
          <Paper elevation={10} className={classes.subject}>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={subject?.picture} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  subject?.nickname && subject?.nickname !== subject?.name
                    ? `${subject?.name} (${subject?.nickname})`
                    : `${subject?.name}`
                }
                secondary={subject?.did !== subject?.name ? subject?.did : undefined}
              />
            </ListItem>
          </Paper>

          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel id="demo-simple-select-label">Issuer</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={issuer}
              onChange={(event) => setIssuer(event.target.value as string)}
              SelectDisplayProps={SelectDisplayProps}
            >
              {identities.map((identity) => (
                <MenuItem value={identity.did} key={identity.did}>
                  <ListItemAvatar>
                    <Avatar src={identity.picture} />
                  </ListItemAvatar>
                  <ListItemText primary={identity.name} secondary={identity.nickname} />
                </MenuItem>
              ))}
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
