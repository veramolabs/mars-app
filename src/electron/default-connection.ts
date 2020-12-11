import { useState, useEffect } from 'react'
import { AgentConnection } from '../types'

export const useElectronDefaultConnection = () => {
  const [defaultConnection, setDefaultConnection] = useState<AgentConnection | undefined>(undefined)

  useEffect(() => {
    if (window.require && !defaultConnection) {
      const { ipcRenderer } = window.require('electron')
      ipcRenderer.send('get-default-connection')
      ipcRenderer.on('default-connection-reply', function (event: any, result: AgentConnection) {
        setDefaultConnection(result)
      })
    }
  }, [defaultConnection])

  return defaultConnection
}
