import {
  createAgent,
  TAgent,
  IDataStore,
  IDIDManager,
  IKeyManager,
  IResolver,
  IMessageHandler,
} from '@veramo/core'
import { ICredentialIssuer, W3cMessageHandler } from '@veramo/credential-w3c'
import { SdrMessageHandler } from '@veramo/selective-disclosure'
import { JwtMessageHandler } from '@veramo/did-jwt'
import { DIDCommMessageHandler, IDIDComm } from '@veramo/did-comm'
import { MessageHandler } from '@veramo/message-handler'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { IDataStoreORM } from '@veramo/data-store'
import { IdentityProfileManager, IProfileManager } from './ProfileManager'
import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'
import { IdentityProfile } from '../types'

type AgentInterfaces = IProfileManager &
  IDataStore &
  IDataStoreORM &
  ICredentialIssuer &
  IDIDManager &
  IDIDComm &
  IKeyManager &
  IResolver &
  IMessageHandler
export type Agent = TAgent<AgentInterfaces>


export interface AgentWithManagedDids {
  agent: TAgent<AgentInterfaces & IProfileManager> & {
    context?: {
      id: string
      name: string
    },
  }
  profiles: IdentityProfile[]
}


export const enabledMethods = [
  'keyManagerGetKeyManagementSystems',
  'keyManagerCreate',
  'keyManagerGet',
  'keyManagerDelete',
  'keyManagerImport',
  'keyManagerEncryptJWE',
  'keyManagerDecryptJWE',
  'keyManagerSignJWT',
  'keyManagerSignEthTX',
  'didManagerGetProviders',
  'didManagerFind',
  'didManagerGet',
  'didManagerCreate',
  'didManagerGetOrCreate',
  'didManagerImport',
  'didManagerDelete',
  'didManagerAddKey',
  'didManagerRemoveKey',
  'didManagerAddService',
  'didManagerRemoveService',
  'resolveDid',
  'dataStoreSaveMessage',
  'dataStoreSaveVerifiableCredential',
  'dataStoreSaveVerifiablePresentation',
  'dataStoreORMGetIdentifiers',
  'dataStoreORMGetIdentifiersCount',
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

export const infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c'

export const defaultAgent = createAgent<AgentInterfaces>({
  plugins: [
    new DIDResolverPlugin({
      resolver: new Resolver({
        ethr: ethrDidResolver({
          networks: [
            { name: 'mainnet', rpcUrl: 'https://mainnet.infura.io/v3/' + infuraProjectId },
            { name: 'rinkeby', rpcUrl: 'https://rinkeby.infura.io/v3/' + infuraProjectId },
            { name: 'ropsten', rpcUrl: 'https://ropsten.infura.io/v3/' + infuraProjectId },
            { name: 'kovan', rpcUrl: 'https://kovan.infura.io/v3/' + infuraProjectId },
            { name: 'goerli', rpcUrl: 'https://goerli.infura.io/v3/' + infuraProjectId },
          ],
        }).ethr,
        web: webDidResolver().web,
      }),
    }),
    new MessageHandler({
      messageHandlers: [
        new DIDCommMessageHandler(),
        new JwtMessageHandler(),
        new W3cMessageHandler(),
        new SdrMessageHandler(),
      ],
    }),
    new IdentityProfileManager(),
  ],
})
