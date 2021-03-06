import { useTheme, useMediaQuery, Dialog, DialogContent, DialogActions, Button, Tab, Tabs, Avatar, Typography, Box, ListItemAvatar, LinearProgress } from '@material-ui/core'
import { DIDDocument } from 'did-resolver'
import React, { useContext, useEffect, useState } from 'react'
import { useAgent } from '../../agent'
import { IdentityProfile } from '../../types'
import IdentifierCredentialsView from '../../views/agent/Identifier/IdentifierCredentialsView'
import IdentifierProfileView from '../../views/agent/Identifier/IdentifierProfileView'
import DIDDocumentCard from '../cards/DIDDocumentCard'
import { useSnackbar } from 'notistack'


interface IdModalContextValue {
  showDid: (did?: string) => void
}

export const IdModalContext = React.createContext<IdModalContextValue>({
  showDid: () => { },
})
export const useIdModal = () => useContext(IdModalContext)

const IdModalProvider: React.FC = ({ children }) => {
  const [did, showDid] = React.useState<string | undefined>(undefined)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const { agent } = useAgent()
  const [identity, setIdentity] = useState<IdentityProfile | undefined>(undefined)
  const isDid = did?.substr(0,3) === 'did'
  const [tab, setTab] = React.useState(0)
  const [didDoc, setDidDoc] = React.useState<DIDDocument | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (tab === 2 && did) {
      setLoading(true)
      agent.resolveDid({ didUrl: did })
        .then(setDidDoc)
        .finally(() => setLoading(false))
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))


    }
  }, [agent, did, tab, enqueueSnackbar])


  useEffect(() => {
    agent.getIdentityProfile({ did }).then(setIdentity)
  }, [agent, did])

  const handleChange = (event: any, newValue: any) => {
    setTab(newValue)
  }

  return (
    <IdModalContext.Provider
      value={{
        showDid
      }}
    >
      {children}

      <Dialog
        fullScreen={fullScreen}
        open={did !== undefined}
        onClose={() => showDid(undefined)}
        maxWidth="sm"
        fullWidth
      >
        <Tabs value={tab} onChange={handleChange} indicatorColor="primary" textColor="primary" variant='fullWidth'>
          <Tab label={`Profile`} />
          <Tab label={`Credentials`} />
          {isDid && <Tab label={`DID`} />}
        </Tabs>




        {did && <DialogContent dividers>
          {tab === 0 && <IdentifierProfileView did={did} />}
          {tab === 1 && <IdentifierCredentialsView did={did} />}
          {tab === 2 && loading && <LinearProgress />}
          {isDid && tab === 2 && !loading && didDoc && <DIDDocumentCard didDoc={didDoc} />}
        </DialogContent>}

        <DialogActions>

          {isDid && <Box display='flex' flexDirection='row' flex={1} marginLeft={1}>
            <ListItemAvatar>
              <Avatar src={identity?.picture} />
            </ListItemAvatar>
            <Box display='block'>
              <Typography variant='body1' noWrap>{`${identity?.name}`}</Typography>
              <Typography variant='caption' noWrap color='textSecondary'>{identity?.nickname}</Typography>
            </Box>

          </Box>}
          {!isDid && <Box display='flex' flexDirection='row' flex={1} marginLeft={1}>
            <Box display='block'>
              <Typography variant='body1' noWrap>{`${identity?.name}`}</Typography>
              <Typography variant='caption' noWrap color='textSecondary'>{identity?.nickname}</Typography>
            </Box>

          </Box>}

          <Button autoFocus onClick={() => showDid(undefined)} color="default">
            Close
        </Button>
        </DialogActions>


      </Dialog>


    </IdModalContext.Provider>
  )
}
export default IdModalProvider
