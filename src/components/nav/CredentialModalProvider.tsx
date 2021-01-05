import { useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core'
import React, { useContext } from 'react'
import CredentialView from '../../views/agent/CredentialView'


interface CredentialContextValue {
  hash?: string
  showCredential: (hash?: string) => void
}

export const CredentialModalContext = React.createContext<CredentialContextValue>({
  hash: undefined,
  showCredential: (hash?: string) => { },
})
export const useCredentialModal = () => useContext(CredentialModalContext)

const CredentialModalProvider: React.FC = ({ children }) => {
  const [hash, showCredential] = React.useState<string | undefined>(undefined)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))


  return (
    <CredentialModalContext.Provider
      value={{
        hash,
        showCredential
      }}
    >
      {children}
      {hash && <Dialog
        fullScreen={fullScreen}
        open
        onClose={() => showCredential(undefined)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Verifiable credential</DialogTitle>
        <DialogContent>
          <CredentialView hash={hash} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => showCredential(undefined)} color="default">
            Close
        </Button>
        </DialogActions>
      </Dialog>}
    </CredentialModalContext.Provider>
  )
}
export default CredentialModalProvider
