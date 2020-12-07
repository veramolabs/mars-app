import React, { useContext, useState, useEffect } from "react";
import { createAgent, TAgent } from 'daf-core'
import { AgentRestClient } from 'daf-rest'
import { IdentityProfile, AgentConnection } from '../types'
import { useElectronDefaultConnection } from './electron'
import { Agent, enabledMethods } from './config'

interface Context {
  agent?: TAgent<Agent>,
  authenticatedDid?: string | null,
  connection?: AgentConnection
  setConnection: (connection: AgentConnection) => void
  setConnections: (connections: Array<AgentConnection>) => void
  connections: Array<AgentConnection>
  getIdentityProfile:(did?: string) => Promise<IdentityProfile>
}

export const AgentContext = React.createContext<Context>({
  connections: [],
  setConnections: (connections: Array<AgentConnection>) => {},
  setConnection: (connection: AgentConnection) => {},
  getIdentityProfile: (did?: string) => Promise.reject(),
});
export const useAgent = () => useContext(AgentContext);

const AgentProvider: React.FC = ({children}) => {

  const [authenticatedDid] = useState<string|null>(null)
  const [agent, setAgent] = useState<TAgent<Agent>|undefined>(undefined)
  const [connections, setConnections] = useState<Array<AgentConnection>>(
    JSON.parse(localStorage.getItem('connections') || '[]')
  )
  const [connection, setConnection] = useState<AgentConnection|undefined>(connections[0])
  const defaultConnection = useElectronDefaultConnection()

  useEffect(() => {
    localStorage.setItem('connections', JSON.stringify(connections));
  }, [connections]);


  useEffect(() => {
    if (connection) {
      const agent = createAgent<Agent>({
        plugins: [
          new AgentRestClient({
            url: connection.url, 
            enabledMethods,
            headers: {
              'Authorization': 'Bearer ' + connection.token
            },
          }),
        ],
      })
      setAgent(agent)  
    }
  }, [connection])


  useEffect(() => {
    if (defaultConnection) {
        const exists = connections.find(item => item.url === defaultConnection.url && item.token === defaultConnection.token )

        if (!exists) {
          const filtered = connections.filter(i => !i.url.match('localhost'))
          setConnections(c => filtered.concat([defaultConnection]))
          setConnection(c => defaultConnection)
        }
    }
  },[defaultConnection, connections, setConnections, setConnection])

  const getIdentityProfile = async (did?: string): Promise<IdentityProfile> => {
    if (!did || !agent) return Promise.reject()
    const result = await agent.dataStoreORMGetVerifiableCredentials({
      where: [
        { column: 'type', value: ['VerifiableCredential,Profile']},
        { column: 'subject', value: [did]}
      ],
      order: [
        { column: 'issuanceDate', direction: 'DESC' }
      ]
    })
    if (result.length > 0) {
      const {name, nickname, picture } = result[0].verifiableCredential.credentialSubject
      return { did, name, nickname, picture }
    } else {
      return { did, name: did, nickname: did }
    }
  }

  return (<AgentContext.Provider value={{
    agent,
    getIdentityProfile,
    authenticatedDid,
    connection,
    setConnection,
    connections,
    setConnections,
  }}>
    {children}
  </AgentContext.Provider>)
}
export default AgentProvider

