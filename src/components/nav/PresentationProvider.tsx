import { useMediaQuery, useTheme } from '@material-ui/core'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import React, { useContext } from 'react'
import PresentationDialog from '../../views/agent/dialogs/PresentationDialog'

interface PresentationContextValue {
  presentationOpen: boolean
  setPresentationOpen: (value: boolean) => void
  reset: () => void
  addCredential: (vc: UniqueVerifiableCredential) => void
  removeCredential: (vc: UniqueVerifiableCredential) => void,
  credentials: UniqueVerifiableCredential[]
}

export const PresentationContext = React.createContext<PresentationContextValue>({
  presentationOpen: false,
  reset: () => { },
  setPresentationOpen: () => { },
  addCredential: (vc: UniqueVerifiableCredential) => { },
  removeCredential: (vc: UniqueVerifiableCredential) => { },
  credentials: [],
})
export const usePresentation = () => useContext(PresentationContext)

const PresentationProvider: React.FC = ({ children }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [presentationOpen, setPresentationOpen] = React.useState(false)
  const [credentials, setCredentials] = React.useState<UniqueVerifiableCredential[]>([])

  const addCredential = (vc: UniqueVerifiableCredential) => {
    setCredentials([...credentials, vc])
  }

  const removeCredential = (vc: UniqueVerifiableCredential) => {
    setCredentials(credentials.filter(c => c.hash !== vc.hash))
  }

  const reset = () => {
    setCredentials([])
  }

  return (
    <PresentationContext.Provider
      value={{
        presentationOpen,
        setPresentationOpen,
        credentials,
        addCredential,
        removeCredential,
        reset
      }}
    >
      {children}

      <PresentationDialog
        fullScreen={fullScreen}
        open={presentationOpen}
        onClose={() => setPresentationOpen(false)}
      />

    </PresentationContext.Provider>
  )
}
export default PresentationProvider
