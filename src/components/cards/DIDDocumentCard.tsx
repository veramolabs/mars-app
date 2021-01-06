import { Box, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, TextField, CardActions, makeStyles } from '@material-ui/core'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { DIDDocument } from 'did-resolver'
import React from 'react'

import MessageIcon from '@material-ui/icons/Message'
import SettingsIcon from '@material-ui/icons/Settings'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import ListIcon from '@material-ui/icons/List'
import CodeIcon from '@material-ui/icons/Code'

const useStyles = makeStyles((theme) => ({
  cardActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1
  }
}))

function DIDDocumentCard ({ didDoc } : {didDoc: DIDDocument}) {
  const classes = useStyles()

  const [cardType, setCardType] = React.useState<'preview' | 'source'>('preview')

  return (

            <Box >


                {cardType === 'preview' && <Box>


                  <List>
                    <ListItem dense>
                      <ListItemAvatar >
                        <CheckCircleIcon />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${didDoc.id}`}
                        secondary={`${didDoc['@context']}`}
                      />
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
                          primary={`${service.type}: ${service.serviceEndpoint}`}
                          secondary={`${service.description}`}
                        />
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
                    <ToggleButton value="preview">
                      <ListIcon />
                    </ToggleButton>
                    <ToggleButton value="source">
                      <CodeIcon />
                    </ToggleButton>

                  </ToggleButtonGroup>

              </CardActions>
            </Box>

  )
}
export default DIDDocumentCard
