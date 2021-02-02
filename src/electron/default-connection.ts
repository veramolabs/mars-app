import { useState, useEffect } from 'react'
import { ISerializedAgentConfig } from '@veramo-community/veramo-react'

export const useElectronDefaultConnection = () => {
  const [defaultConnection, setDefaultConnection] = useState<ISerializedAgentConfig | undefined>(undefined)

  useEffect(() => {
    if (window.require && !defaultConnection) {
      const { ipcRenderer } = window.require('electron')
      ipcRenderer.send('get-default-connection')
      ipcRenderer.on('default-connection-reply', function (event: any, result: ISerializedAgentConfig) {
        if (result.context.schemaUrl)
          fetch(result.context.schemaUrl)
            .then((res) => res.json())
            .then((schema) => {
              const enabledMethods = []
              for (const path of Object.keys(schema.paths)) {
                enabledMethods.push(schema.paths[path].post.operationId)
              }
              result.remoteAgents[0].enabledMethods = enabledMethods
              setDefaultConnection(result)
            })
      })
    }
  }, [defaultConnection])

  return defaultConnection
}
