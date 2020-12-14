import { useState, useEffect } from 'react'
import { SerializedAgentConfig } from '../agent/AgentListProvider'
export const useElectronDefaultConnection = () => {
  const [defaultConnection, setDefaultConnection] = useState<SerializedAgentConfig | undefined>(undefined)

  useEffect(() => {
    if (window.require && !defaultConnection) {
      const { ipcRenderer } = window.require('electron')
      ipcRenderer.send('get-default-connection')
      ipcRenderer.on('default-connection-reply', function (event: any, result: SerializedAgentConfig) {
        if (result.schemaUrl)
          fetch(result.schemaUrl)
            .then((res) => res.json())
            .then((schema) => {
              const enabledMethods = []
              for (const path of Object.keys(schema.paths)) {
                enabledMethods.push(schema.paths[path].post.operationId)
              }
              setDefaultConnection({ ...result, enabledMethods })
            })
      })
    }
  }, [defaultConnection])

  return defaultConnection
}
