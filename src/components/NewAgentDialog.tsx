import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { Dialog, DialogTitle, DialogContent, DialogActions, makeStyles, TextField } from "@material-ui/core";
import { enabledMethods, Agent } from "../agent/config";
import { NamedAgent } from "../agent/AgentListProvider";
import { IdentityProfileManager } from "../agent/ProfileManager";
import { createAgent } from "daf-core";
import { AgentRestClient } from "daf-rest";

interface Props {
  fullScreen: boolean,
  open: boolean,
  onClose: any,
  saveAgent: (agent: NamedAgent) => void
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
    minWidth: 220,
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

function NewAgentDialog(props: Props) {
  const classes = useStyles()

  const [name, setName] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [token, setToken] = useState<string>('')

  const configureAgent = () => {
    const agent = createAgent<Agent>({
      plugins: [
        new AgentRestClient({
          url, 
          enabledMethods,
          headers: {
            'Authorization': 'Bearer ' + token
          },
        }),
        new IdentityProfileManager(),
      ],
    })

    props.saveAgent({
      name,
      agent
    })
  }

  return (
    <Dialog
        fullScreen={props.fullScreen}
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Add Cloud Agent</DialogTitle>
        <DialogContent>
        <form className={classes.form}>

          <TextField
            id="url"
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            id="url"
            label="Agent URL"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth
          />

          <TextField
            id="token"
            label="Token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            fullWidth
          />

        </form>

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.onClose} color="default">
            Cancel
          </Button>
          <Button 
            onClick={configureAgent}
            color="primary"
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )


}

export default NewAgentDialog;