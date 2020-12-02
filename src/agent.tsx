import React, { useContext, useState, useEffect } from "react";
import { createAgent, TAgent, IDataStore, IIdentityManager, IKeyManager, IResolver } from 'daf-core'
import { ICredentialIssuer } from 'daf-w3c'
import { IDataStoreORM } from 'daf-typeorm'
import { AgentRestClient } from 'daf-rest'
import { IdentityProfile } from './types'

const url = `${process.env.REACT_APP_AGENT_URL}`
const apiKey = `${process.env.REACT_APP_AGENT_API_KEY}`
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
  agent: TAgent<Agent>,
  authenticatedDid: string | null,
  url: string
  apiKey: string
  setUrl: (url: string) => void
  setApiKey: (apiKey: string) => void
  getIdentityProfile:(did?: string) => Promise<IdentityProfile>
}

const defaultAgent = createAgent<Agent>({
  plugins: [ new AgentRestClient({ url, enabledMethods, headers: { Authorization: 'Bearer ' + apiKey} })],
})


export const AgentContext = React.createContext<Context>({
  agent: defaultAgent,
  authenticatedDid: null,
  setApiKey: (key: string) => {},
  setUrl: (url: string) => {},
  getIdentityProfile: (did?: string) => Promise.reject(),
  url: '',
  apiKey: ''
});
export const useAgent = () => useContext(AgentContext);

const AgentProvider: React.FC = ({children}) => {

  const [authenticatedDid] = useState<string|null>(null)
  const [agent, setAgent] = useState<TAgent<Agent>>(defaultAgent)
  const [url, setUrl] = useState<string>(`${process.env.REACT_APP_AGENT_URL}`)
  const [apiKey, setApiKey] = useState<string>(`${process.env.REACT_APP_AGENT_API_KEY}`)


  useEffect(() => {
    const configureAgent = async () => {
      const agent = createAgent<Agent>({
        plugins: [
          new AgentRestClient({
            url, 
            enabledMethods,
            headers: {
              'Authorization': 'Bearer ' + apiKey
            },
          }),
        ],
      })
      setAgent(agent)  

    }
    if (url) {
      configureAgent()
    }
  

  }, [url, apiKey])


  const getIdentityProfile = async (did?: string): Promise<IdentityProfile> => {
    if (!did) return Promise.reject()
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
    setUrl,
    setApiKey,
    url,
    apiKey
  }}>
    {children}
  </AgentContext.Provider>)
}
export default AgentProvider

