import { Box, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, TextField, CardActions, makeStyles, ListItemSecondaryAction, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@material-ui/core'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { DIDDocument } from 'did-resolver'
import React from 'react'

import MessageIcon from '@material-ui/icons/Message'
import SettingsIcon from '@material-ui/icons/Settings'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import CodeIcon from '@material-ui/icons/Code'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreIcon from '@material-ui/icons/MoreVert'

const useStyles = makeStyles((theme) => ({
  cardActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1
  }
}))

function DIDDocumentCard({ didDoc, isManaged }: { didDoc: DIDDocument, isManaged?: boolean }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const [cardType, setCardType] = React.useState<'preview' | 'source'>('preview')
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  return (

    <Box >

      {cardType !== 'source' && <Box>
        <List>
          <ListItem dense>
            <ListItemAvatar >
              <CheckCircleIcon />
            </ListItemAvatar>
            <ListItemText
              primary={`${didDoc.id}`}
              secondary={`${didDoc['@context']}`}
            />
            {isManaged && <ListItemSecondaryAction>
              <IconButton edge="end" onClick={handleOpen}>
                <MoreIcon />
              </IconButton>
            </ListItemSecondaryAction>}

          </ListItem>
        </List>


        {didDoc.service && didDoc.service?.length > 0 && <List subheader={
          <ListSubheader>
            Services
          </ListSubheader>
        }>
          {didDoc.service?.map((service, index) => (
            <ListItem key={index} dense>
              <ListItemAvatar >
                {service.type === 'Messaging' ? <MessageIcon /> : <SettingsIcon />}
              </ListItemAvatar>
              <ListItemText
                secondary={`${service.serviceEndpoint}`}
                primary={`${service.description}`}
              />
              {isManaged && <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>}
            </ListItem>
          ))}
        </List>}


        <List subheader={
          <ListSubheader>
            Public keys
                  </ListSubheader>
        }>
          {didDoc.publicKey.map((key, index) => (
            <ListItem key={index} dense>
              <ListItemAvatar >
                <VpnKeyIcon />
              </ListItemAvatar>
              <ListItemText
                primary={`${key.type}`}
                secondary={`${key.controller ? 'Controller: ' + key.controller : ''}`}
              />
              {isManaged && <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>}
            </ListItem>
          ))}
        </List>

        <List subheader={
          <ListSubheader>
            Authentication
                  </ListSubheader>
        }>
          {didDoc.authentication?.map((auth: any, index) => (
            <ListItem key={index} dense>
              <ListItemAvatar >
                <VpnKeyIcon />
              </ListItemAvatar>
              <ListItemText
                primary={`${auth?.type}`}
                secondary={`${auth?.publicKey?.substr(0, 10)}...${auth?.publicKey?.substr(-10)}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>}

      {cardType === 'source' && <TextField
        label="DID Document"
        multiline
        rows={30}
        value={JSON.stringify(didDoc, null, 2)}
        fullWidth
        margin="normal"
        variant="outlined"
        inputProps={{ style: { fontFamily: 'monospace' } }}
      />}

      <CardActions className={classes.cardActions}>


        <ToggleButtonGroup
          value={cardType}
          exclusive
          size="small"
          onChange={(event, newCardType) => { setCardType(newCardType) }}
        >
          <ToggleButton value="source">
            <CodeIcon />
          </ToggleButton>

        </ToggleButtonGroup>

      </CardActions>

      <Menu id="lock-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => { }}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Add service
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => { }}>
          <ListItemIcon>
            <VpnKeyIcon />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Add public key
          </Typography>
        </MenuItem>


      </Menu>

    </Box>

  )
}
export default DIDDocumentCard
