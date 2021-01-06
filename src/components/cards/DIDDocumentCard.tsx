import { Grid, Card, CardContent, Box, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, TextField, CardActions, makeStyles } from '@material-ui/core'
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
    justifyContent: 'flex-end',
    flex: 1
  }
}))

function DIDDocumentCard ({ didDoc } : {didDoc: DIDDocument}) {
  const classes = useStyles()

  const [cardType, setCardType] = React.useState<'preview' | 'source'>('preview')

  return (
    <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>

                {cardType === 'preview' && <Box>


                  <List>
                    <ListItem>
                      <ListItemAvatar >
                        <CheckCircleIcon />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${didDoc.id}`}
                        secondary={`${didDoc['@context']}`}
                      />
                    </ListItem>
                  </List>


                  <List subheader={
                    <ListSubheader>
                      Services
                  </ListSubheader>
                  }>
                    {didDoc.service?.map(service => (
                      <ListItem>
                        <ListItemAvatar >
                          {service.type === 'Messaging' ? <MessageIcon /> : <SettingsIcon />}
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${service.type}: ${service.serviceEndpoint}`}
                          secondary={`${service.description}`}
                        />
                      </ListItem>
                    ))}
                  </List>


                  <List subheader={
                    <ListSubheader>
                      Public keys
                  </ListSubheader>
                  }>
                    {didDoc.publicKey.map(key => (
                      <ListItem>
                        <ListItemAvatar >
                          <VpnKeyIcon />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${key.type}`}
                          secondary={`${key.publicKeyHex?.substr(0, 10)}...${key.publicKeyHex?.substr(-10)}${key.controller ? ', controller: ' + key.controller : ''}`}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <List subheader={
                    <ListSubheader>
                      Authentication
                  </ListSubheader>
                  }>
                    {didDoc.authentication?.map((auth: any) => (
                      <ListItem>
                        <ListItemAvatar >
                          <VpnKeyIcon />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${auth?.type}`}
                          secondary={`${auth?.publicKey?.substr(0, 50)}...${auth?.publicKey?.substr(-10)}`}
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
              </CardContent>
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
            </Card>
          </Grid>
  )
}
export default DIDDocumentCard
