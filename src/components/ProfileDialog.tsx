import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { useAgent } from "../agent";
import { useHistory } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, makeStyles, TextField } from "@material-ui/core";
import shortId from 'shortid'

interface Props {
  fullScreen: boolean,
  open: boolean,
  onClose: any,
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
}));

function ProfileDialog(props: Props) {
  const classes = useStyles()
  const history = useHistory()
  const { agent, authenticatedDid } = useAgent()

  const [name, setName] = useState<string|undefined>('')
  const [nickname, setNickname] = useState<string|undefined>('')

  const saveProfileInfo = async () => {
    try {
      if (!authenticatedDid) throw Error('Not authenticated')

      const credentialSubject = {
        id: props.subject,
      } as { 
        id: string,
        name?: string,
        nickname?: string,
      }

      if (name) credentialSubject['name'] = name
      if (nickname) credentialSubject['nickname'] = nickname

      const uniqId = shortId.generate()
      await agent.createVerifiableCredential({
        credential: {
          issuer: { id: authenticatedDid },
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'Profile'],
          issuanceDate: new Date().toISOString(),
          id: process.env.REACT_APP_HOST + '/c/' + uniqId,
          credentialSubject,
        },
        save: true,
        proofFormat: 'jwt',
      })

      props.onClose()
      history.push('/c/'+ uniqId)

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
        fullScreen={props.fullScreen}
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Update profile information</DialogTitle>
        <DialogContent>
        <form className={classes.form}>

          <TextField
            id="name"
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            id="nickname"
            label="Nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            fullWidth
          />

        </form>

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.onClose} color="default">
            Cancel
          </Button>
          <Button onClick={saveProfileInfo} color="primary" autoFocus>
            Sign
          </Button>
        </DialogActions>
      </Dialog>
    )


}

export default ProfileDialog;