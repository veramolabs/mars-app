import { useTheme, useMediaQuery, Dialog, DialogContent, DialogActions, Button, Tab, Tabs, Avatar, Typography, Box, ListItemAvatar } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { useAgent } from '../../agent'
import { IdentityProfile } from '../../types'
import IdentifierCredentialsView from '../../views/agent/Identifier/IdentifierCredentialsView'
import IdentifierProfileView from '../../views/agent/Identifier/IdentifierProfileView'


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
  const [tab, setTab] = React.useState(0)


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
          <Box display='flex' flexDirection='row' margin={2}>
            <ListItemAvatar>
              <Avatar src={identity?.picture} />
            </ListItemAvatar>
            <Box display='block'>
              
            <Typography variant='body1' noWrap>{`${identity?.name} (${identity?.nickname})`}</Typography>
            <Typography variant='caption' noWrap color='textSecondary'>{identity?.did}</Typography>
            </Box>

          </Box>

          <Tabs value={tab} onChange={handleChange} indicatorColor="primary" textColor="primary">
            <Tab label={`Profile`} />
            <Tab label={`Credentials`} />
          </Tabs>
        {did && <DialogContent dividers>
          {tab === 0 && <IdentifierProfileView did={did} />}
          {tab === 1 && <IdentifierCredentialsView did={did} />}
        </DialogContent>}

        <DialogActions>
          <Button autoFocus onClick={() => showDid(undefined)} color="default">
            Close
        </Button>
        </DialogActions>
      </Dialog>


    </IdModalContext.Provider>
  )
}
export default IdModalProvider
