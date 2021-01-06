import { Box, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, TextField, CardActions, makeStyles, ListItemSecondaryAction, IconButton, ListItemIcon, Menu, MenuItem, Typography, Button, Dialog, DialogActions, DialogContent, useMediaQuery, useTheme, DialogTitle } from '@material-ui/core'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { DIDDocument } from 'did-resolver'
import React, { useState } from 'react'
import shortId from 'shortid'
import MessageIcon from '@material-ui/icons/Message'
import SettingsIcon from '@material-ui/icons/Settings'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import CodeIcon from '@material-ui/icons/Code'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreIcon from '@material-ui/icons/MoreVert'
import { useSnackbar } from 'notistack'
import { useAgent } from '../../agent'

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
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()
  const { agent } = useAgent()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serviceId, setServiceId] = useState(didDoc.id + '#' + shortId.generate())
  const [serviceType, setServiceType] = useState('')
  const [serviceEndpoint, setServiceEndpoint] = useState('')
  const [serviceDescription, setServiceDescription] = useState('')

  const [cardType, setCardType] = React.useState<'preview' | 'source'>('preview')
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const addService = async () => {
    setLoading(true)
    try {
      await agent.didManagerAddService({
        did: didDoc.id,
        service: {
          id: serviceId,
          type: serviceType,
          serviceEndpoint,
          description: serviceDescription
        }
      })
      setShowServiceModal(false)
      enqueueSnackbar('Service added', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
    setLoading(false)
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
        <MenuItem onClick={() => { setShowServiceModal(true) }}>
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

      <Dialog
        fullScreen={fullScreen}
        open={showServiceModal}
        onClose={() => {
          setShowServiceModal(false)
        }}
        maxWidth="sm"
        fullWidth
        scroll='paper'
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>Add service</DialogTitle>
        <DialogContent>
          <TextField
            label="DID"
            value={didDoc.id}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled
            aria-readonly
          />
          <TextField
            label="Service ID"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />

          <TextField
            label="Service type"
            placeholder='Messaging'
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />

          <TextField
            label="Service endpoint"
            placeholder='https://example.com/messaging'
            value={serviceEndpoint}
            onChange={(e) => setServiceEndpoint(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />

          <TextField
            label="Service description"
            placeholder='Handles incoming POST messages'
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />

        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              setShowServiceModal(false)
            }}
            color="default"

          >
            Close
          </Button>
          <Button
            autoFocus
            onClick={addService}
            color="primary"
            disabled={loading}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

    </Box>

  )
}
export default DIDDocumentCard
