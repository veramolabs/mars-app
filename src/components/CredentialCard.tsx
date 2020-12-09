import React, { useState, useEffect } from "react";
import { CardActions, CardHeader, IconButton, LinearProgress, ListItemIcon, Menu, MenuItem, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionAreaLink from "./Nav/CardActionAreaLink";
import Avatar from '@material-ui/core/Avatar';
import { formatDistanceToNow } from 'date-fns'
import { UniqueVerifiableCredential } from "daf-typeorm";
import { IdentityProfile } from "../types";
import { useAgent, useAgentList } from '../agent'
import { useSnackbar } from 'notistack';
import PostCredential from "./CredentialCardContent/PostCredential";
import ProfileCredential from "./CredentialCardContent/ProfileCredential";
import ReactionCredential from "./CredentialCardContent/ReactionCredential";
import MessageCredential from "./CredentialCardContent/MessageCredential";
import CopyIcon from '@material-ui/icons/FileCopy';

interface Props {
  credential: UniqueVerifiableCredential
  type: 'summary' | 'details'
}

function CredentialPostCard(props: Props) {
  const { credential: { verifiableCredential, hash } } = props
  const { enqueueSnackbar } = useSnackbar()
  const { agent } = useAgent()
  const { agentList, activeAgentIndex } = useAgentList()
  const [ loading, setLoading ] = useState(false)
  const [ issuer, setIssuer ] = useState<IdentityProfile>({ did: verifiableCredential.issuer.id })
  const [ subject, setSubject ] = useState<IdentityProfile|undefined>(undefined)
  const [anchorEl, setAnchorEl] = React.useState(null);


  const handleClickCopyButton = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = async (event: any, index: number) => {
    // setSelectedIndex(index);
    try {
      await agentList[index].agent.dataStoreSaveVerifiableCredential({verifiableCredential})
      enqueueSnackbar('Credential copied to: ' + agentList[index].name, { variant: 'success'})
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error'})
    }
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
    setLoading(true)
    Promise.all<IdentityProfile, IdentityProfile>([
      agent.getIdentityProfile({did: verifiableCredential.issuer.id}),
      agent.getIdentityProfile({ did: verifiableCredential.issuer.id})
    ])
    .then(profiles => {
      setIssuer(profiles[0])
      setSubject(profiles[1])
    })
    .finally(() => setLoading(false))
  }, [agent, verifiableCredential.issuer.id, verifiableCredential.credentialSubject.id])

  if (loading) {
    return (<LinearProgress />)
  }

  let contents
  if (verifiableCredential.type.includes('Post')) {
    contents = (<PostCredential  {...props} issuer={issuer} subject={subject} /> )
  } else if (verifiableCredential.type.includes('Profile')) {
    contents = (<ProfileCredential  {...props} issuer={issuer} subject={subject} /> )
  } else if (verifiableCredential.type.includes('Reaction')) {
    contents = (<ReactionCredential  {...props} issuer={issuer} subject={subject} /> )
  } else if (verifiableCredential.type.includes('Message')) {
    contents = (<MessageCredential  {...props} issuer={issuer} subject={subject} /> )
  } 

  
  
  return (
    <Card elevation={2}>
      <CardActionAreaLink to={'/agent/identity/' + issuer.did}>
        <CardHeader
          avatar={
            <Avatar src={issuer.picture} />
          }
          title={`${issuer.name}`}
          subheader={`${issuer.nickname} | ${formatDistanceToNow(Date.parse(verifiableCredential.issuanceDate))} ago`}
        />
      </CardActionAreaLink>
      <CardActionAreaLink to={ props.type === 'summary' ? '/agent/credential/' + hash : '/agent/identity/' + subject?.did}>
        {contents}
      </CardActionAreaLink>
      <CardActions disableSpacing>
        <IconButton aria-label="Copy" onClick={handleClickCopyButton}>
          <CopyIcon />
        </IconButton>
      </CardActions>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {agentList.map((option, index) => (
          <MenuItem
            key={index}
            disabled={!option.agent.availableMethods().includes('dataStoreSaveVerifiableCredential') || index === activeAgentIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            <ListItemIcon>
            <Avatar
              >{option.name.substr(0,2)}</Avatar>
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              {option.name}
            </Typography>

            
          </MenuItem>
        ))}
      </Menu>
    </Card>
  )
}

export default CredentialPostCard;