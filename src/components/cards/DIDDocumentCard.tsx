import { Box, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, TextField, CardActions, makeStyles, ListItemSecondaryAction, IconButton, ListItemIcon, Menu, MenuItem, Typography, Button, Dialog, DialogActions, DialogContent, useMediaQuery, useTheme, DialogTitle, FormControl, InputLabel, Select } from '@material-ui/core'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { DIDDocument, ServiceEndpoint } from 'did-resolver'
import React, { useEffect, useState } from 'react'
import shortId from 'shortid'
import MessageIcon from '@material-ui/icons/Message'
import SettingsIcon from '@material-ui/icons/Settings'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import CodeIcon from '@material-ui/icons/Code'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreIcon from '@material-ui/icons/MoreVert'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import { useSnackbar } from 'notistack'
import { useAgent, useAgentList } from '../../agent'
import { IIdentifier, TKeyType } from '@veramo/core'

const useStyles = makeStyles((theme) => ({
  cardActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1
  }
}))

function DIDDocumentCard({ didDoc }: { didDoc: DIDDocument }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()
  const { agent } = useAgent()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [loading, setLoading] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [serviceId, setServiceId] = useState(didDoc.id + '#' + shortId.generate())
  const [serviceType, setServiceType] = useState('')
  const [serviceEndpoint, setServiceEndpoint] = useState('')
  const [serviceDescription, setServiceDescription] = useState('')
  const [keyManagementSystems, setKeyManagementSystems] = useState<string[]>([])
  const [showPublicKeyModal, setShowPublicKeyModal] = useState(false)
  const [keyType, setKeyType] = useState<TKeyType>('Ed25519')
  const [kms, setKms] = useState('')
  const [managedIdentifier, setManagedIdentifier] = useState<IIdentifier | undefined>(undefined)
  const { openNewAgentModal } = useAgentList()

  const [cardType, setCardType] = React.useState<'preview' | 'source'>('preview')

  useEffect(() => {
    setManagedIdentifier(undefined)
    if (agent?.availableMethods().includes('didManagerGet')) {

        agent
        .didManagerGet({did: didDoc.id})
        .then((did) => {
          // FIXME didManagerGet should return only identifiers that have a provider
          if (did.provider != null) {
            setManagedIdentifier(did)
          }
        })
        .catch(e => {
          console.log(e)
        })
    }

  }, [didDoc, agent])

  useEffect(() => {
    if (managedIdentifier && agent?.availableMethods().includes('keyManagerGetKeyManagementSystems')) {
      setLoading(true)
      agent.keyManagerGetKeyManagementSystems()
        .then((res) => {
          setKeyManagementSystems(res)
          setKms(res[0])
        })
        .finally(() => setLoading(false))
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    }
  }, [agent, managedIdentifier, enqueueSnackbar])

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

  const removeService = async (serviceId: string) => {

    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure?')) {

      setLoading(true)
      try {
        //FIXME
        await agent.didManagerRemoveService({
          did: didDoc.id,
          id: serviceId
        })
        setShowServiceModal(false)
        enqueueSnackbar('Service removed', { variant: 'success' })
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' })
      }
      setLoading(false)
    }
  }

  const removeKey = async (kid: string) => {
    setLoading(true)
    try {
      //FIXME
      await agent.didManagerRemoveKey({
        did: didDoc.id,
        kid
      })
      setShowServiceModal(false)
      enqueueSnackbar('Key removed', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
    setLoading(false)
  }

  const addKey = async () => {
    setLoading(true)
    try {

      const newKey = await agent.keyManagerCreate({
        kms,
        type: keyType,
      })

      await agent.didManagerAddKey({
        did: didDoc.id,
        key: newKey,
      })

      setShowPublicKeyModal(false)
      enqueueSnackbar('Key added', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
    setLoading(false)
  }

  const handleServiceClick = (service: ServiceEndpoint) => {
    if (service.type === 'VeramoSchema') {
      openNewAgentModal(service.serviceEndpoint)
    }
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
            {managedIdentifier && <ListItemSecondaryAction>
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
            <ListItem 
              button
              key={index} dense onClick={() => handleServiceClick(service)}>
              <ListItemAvatar >
                {service.type === 'Messaging' ? <MessageIcon /> : 
                  service.type === 'VeramoSchema' ? <VerifiedUserIcon /> : <SettingsIcon />}
              </ListItemAvatar>
              <ListItemText
                secondary={`${service.serviceEndpoint}`}
                primary={`${service.description}`}
              />
              {managedIdentifier && <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete"  onClick={()=> removeService(service.id)}>
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
              {managedIdentifier && <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={()=> removeKey(key.id)}>
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
        <MenuItem onClick={() => { setShowPublicKeyModal(true) }}>
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

      <Dialog
        fullScreen={fullScreen}
        open={showPublicKeyModal}
        onClose={() => {
          setShowPublicKeyModal(false)
        }}
        maxWidth="sm"
        fullWidth
        scroll='paper'
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>Add public key</DialogTitle>
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
          <Box display='flex' flex={1} flexDirection='column'>

            <FormControl variant="outlined" margin="normal">
              <InputLabel htmlFor="age-native-simple">Key management system</InputLabel>
              <Select value={kms} onChange={(e) => setKms(e.target.value as string)}>
                {keyManagementSystems.map((k) => (
                  <MenuItem value={k}>{k}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" margin="normal">
              <InputLabel htmlFor="age-native-simple">Key management system</InputLabel>
              <Select value={keyType} onChange={(e) => setKeyType(e.target.value as any)}>
                {['Ed25519', 'Secp256k1'].map((k) => (
                  <MenuItem value={k} key={k}>{k}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              setShowPublicKeyModal(false)
            }}
            color="default"

          >
            Close
          </Button>
          <Button
            autoFocus
            onClick={addKey}
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
