import React from 'react'
import { useVeramo, ISerializedAgentConfig } from '@veramo-community/veramo-react'
import { useSnackbar } from 'notistack'

import NewAgentDialog from '../../views/agent/dialogs/NewAgentDialog'
import { useMediaQuery, useTheme } from '@material-ui/core'

export const AgentModalContext = React.createContext<{
  openNewAgentModal: (schemaUrl?: string) => void
}>({
  openNewAgentModal: () => {}
})

export const AgentModalProvider: React.FC = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [newAgentOpen, setNewAgentOpen] = React.useState(false)
  const [newAgentSchemaUrl, setNewAgentSchemaUrl] = React.useState<string|undefined>(undefined)
  const { addAgentConfig } = useVeramo()

  const openNewAgentModal = (schemaUrl?: string) => {
    setNewAgentSchemaUrl(schemaUrl)
    setNewAgentOpen(true)
  }

  const saveAgentConfig = (config: ISerializedAgentConfig) => {
    addAgentConfig(config)
    setNewAgentOpen(false)
    enqueueSnackbar('Agent added:' + config.context.name)
  }

  return (
    <AgentModalContext.Provider
      value={{
        openNewAgentModal
      }}
    >
      {children}
      <NewAgentDialog
        fullScreen={fullScreen}
        open={newAgentOpen}
        onClose={() => setNewAgentOpen(false)}
        schemaUrl={newAgentSchemaUrl}
        saveAgentConfig={saveAgentConfig}
      />
    </AgentModalContext.Provider>
  )
}

export const useAgentModal = () => React.useContext(AgentModalContext)
export const AgentListConsumer = AgentModalContext.Consumer
