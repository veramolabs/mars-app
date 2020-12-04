import React, { useContext, useState, useEffect } from "react";
import { createAgent, TAgent, IDataStore, IIdentityManager, IKeyManager, IResolver } from 'daf-core'
import { ICredentialIssuer } from 'daf-w3c'
import { IDataStoreORM } from 'daf-typeorm'
import { AgentRestClient } from 'daf-rest'
import { IdentityProfile, AgentConnection } from './types'

const enabledMethods = [
  'keyManagerGetKeyManagementSystems',
  'keyManagerCreateKey',
  'keyManagerGetKey',
  'keyManagerDeleteKey',
  'keyManagerImportKey',
  'keyManagerEncryptJWE',
  'keyManagerDecryptJWE',
  'keyManagerSignJWT',
  'keyManagerSignEthTX',
  'identityManagerGetProviders',
  'identityManagerGetIdentities',
  'identityManagerGetIdentity',
  'identityManagerCreateIdentity',
  'identityManagerGetOrCreateIdentity',
  'identityManagerImportIdentity',
  'identityManagerDeleteIdentity',
  'identityManagerAddKey',
  'identityManagerRemoveKey',
  'identityManagerAddService',
  'identityManagerRemoveService',
  'resolveDid',
  'dataStoreSaveMessage',
  'dataStoreSaveVerifiableCredential',
  'dataStoreGetVerifiableCredential',
  'dataStoreSaveVerifiablePresentation',
  'dataStoreORMGetIdentities',
  'dataStoreORMGetIdentitiesCount',
  'dataStoreORMGetMessages',
  'dataStoreORMGetMessagesCount',
  'dataStoreORMGetVerifiableCredentialsByClaims',
  'dataStoreORMGetVerifiableCredentialsByClaimsCount',
  'dataStoreORMGetVerifiableCredentials',
  'dataStoreORMGetVerifiableCredentialsCount',
  'dataStoreORMGetVerifiablePresentations',
  'dataStoreORMGetVerifiablePresentationsCount',
  'handleMessage',
  'sendMessageDIDCommAlpha1',
  'createVerifiablePresentation',
  'createVerifiableCredential',
  'createSelectiveDisclosureRequest',
  'getVerifiableCredentialsForSdr',
  'validatePresentationAgainstSdr',
]

type Agent = IDataStore & IDataStoreORM & ICredentialIssuer & IIdentityManager & IKeyManager & IResolver



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

