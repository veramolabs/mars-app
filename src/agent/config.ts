import {
  createAgent,
  TAgent,
  IDataStore,
  IIdentityManager,
  IKeyManager,
  IResolver,
  IMessageHandler,
} from 'daf-core'
import { ICredentialIssuer, W3cMessageHandler } from 'daf-w3c'
import { SdrMessageHandler } from 'daf-selective-disclosure'
import { JwtMessageHandler } from 'daf-did-jwt'
import { DIDCommMessageHandler } from 'daf-did-comm'
import { MessageHandler } from 'daf-message-handler'
import { DafResolver } from 'daf-resolver'
import { IDataStoreORM } from 'daf-typeorm'
import { IdentityProfileManager, IProfileManager } from './ProfileManager'

type AgentInterfaces = IProfileManager &
  IDataStore &
  IDataStoreORM &
  ICredentialIssuer &
  IIdentityManager &
  IKeyManager &
  IResolver &
  IMessageHandler
export type Agent = TAgent<AgentInterfaces>

export const enabledMethods = [
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

export const infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c'

export const defaultAgent = createAgent<AgentInterfaces>({
  plugins: [
    new DafResolver({ infuraProjectId }),
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
