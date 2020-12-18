import { IAgentPlugin, IPluginMethodMap, IAgentContext } from '@veramo/core'
import { IDataStoreORM } from '@veramo/data-store'
import { IdentityProfile } from '../types'

type IContext = IAgentContext<IDataStoreORM>

export interface IGetIdentityProfileArgs {
  /**
   * Decentralized identifier
   */
  did?: string
}

export interface IProfileManager extends IPluginMethodMap {
  getIdentityProfile(args: IGetIdentityProfileArgs, context: IContext): Promise<IdentityProfile>
}

export class IdentityProfileManager implements IAgentPlugin {
  readonly methods: IProfileManager = {
    getIdentityProfile: this.getIdentityProfile.bind(this),
  }

  private async getIdentityProfile(
    args: IGetIdentityProfileArgs,
    context: IContext,
  ): Promise<IdentityProfile> {
    if (!args.did) return Promise.reject('DID Required')
    const result = await context.agent.dataStoreORMGetVerifiableCredentials({
      where: [
        { column: 'type', value: ['VerifiableCredential,Profile'] },
        { column: 'subject', value: [args.did] },
      ],
      order: [{ column: 'issuanceDate', direction: 'DESC' }],
    })
    if (result.length > 0) {
      const { name, nickname, picture } = result[0].verifiableCredential.credentialSubject
      return { did: args.did, name, nickname, picture }
    } else {
      return { did: args.did, name: args.did }
    }
  }
}
