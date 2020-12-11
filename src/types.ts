export interface IdentityProfile {
  did: string
  name?: string
  nickname?: string
  picture?: string
}

export interface AgentConnection {
  url: string
  token: string
}
