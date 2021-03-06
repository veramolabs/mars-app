import React, { useState, useContext, useEffect } from 'react'
import { AgentProvider } from './AgentProvider'
import { Agent, defaultAgent, infuraProjectId } from './config'
import { IdentityProfileManager } from '../agent/ProfileManager'
import { createAgent, IAgentPlugin, IAgentPluginSchema } from '@veramo/core'
import { AgentRestClient } from '@veramo/remote-client'
import { useSnackbar } from 'notistack'
import { W3cMessageHandler } from '@veramo/credential-w3c'
import { SdrMessageHandler } from '@veramo/selective-disclosure'
import { JwtMessageHandler } from '@veramo/did-jwt'
import { DIDCommMessageHandler } from '@veramo/did-comm'
import { MessageHandler } from '@veramo/message-handler'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'
import NewAgentDialog from '../views/agent/dialogs/NewAgentDialog'
import { useMediaQuery, useTheme } from '@material-ui/core'
export interface SerializedAgentConfig {
  name: string
  schema?: IAgentPluginSchema
  schemaUrl?: string
  apiUrl?: string
  token?: string
  enabledMethods?: string[]
}

export interface AgentConfig {
  name: string
  agent: Agent
  schema?: IAgentPluginSchema
  schemaUrl?: string
  apiUrl?: string
  token?: string
  enabledMethods?: string[]
}

const defaultNamedAgent = { name: 'default', agent: defaultAgent }

export const AgentListContext = React.createContext<{
  agentList: Array<AgentConfig>
  activeAgentIndex: number
  defaultDid?: string
  setDefaultDid: (did: string) => void
  setActiveAgentIndex: (index: number) => void
  addAgent: (agent: AgentConfig) => void
  addSerializedAgentConfig: (config: SerializedAgentConfig) => void
  removeAgent: (index: number) => void
  openNewAgentModal: (schemaUrl?: string) => void
}>({
  agentList: [defaultNamedAgent],
  activeAgentIndex: 0,
  setDefaultDid: (did: string) => {},
  setActiveAgentIndex: (index: number) => {},
  addAgent: (agent: AgentConfig) => {},
  addSerializedAgentConfig: (config: SerializedAgentConfig) => {},
  removeAgent: (index: number) => {},
  openNewAgentModal: () => {}
})

export const AgentListProvider: React.FC = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [defaultDid, setDefaultDid] = useState<string | undefined>()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [newAgentOpen, setNewAgentOpen] = React.useState(false)
  const [newAgentSchemaUrl, setNewAgentSchemaUrl] = React.useState<string|undefined>(undefined)

  const agentListToJSON = (agentList: AgentConfig[]): string => {
    // Removing agent object from serialized config
    return JSON.stringify(agentList.map((c) => ({ ...c, agent: undefined })))
  }

  const deserializeAgentConfig = (config: SerializedAgentConfig): AgentConfig => {
    const plugins = []

    if (config.apiUrl) {
      const options = {
        url: config.apiUrl,
        schema: config.schema,
        enabledMethods: config.enabledMethods || [],
        headers: config.token ? { Authorization: 'Bearer ' + config.token } : undefined,
      }
      plugins.push(new AgentRestClient(options))
    } else {
      plugins.push(
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
      )
      plugins.push(
        new MessageHandler({
          messageHandlers: [
            new DIDCommMessageHandler(),
            new JwtMessageHandler(),
            new W3cMessageHandler(),
            new SdrMessageHandler(),
          ],
        }),
      )
    }
    plugins.push(new IdentityProfileManager())

    // plugins.push({
    //   eventTypes: ['ev_err'],
    //   onEvent: (event, ctx) => {
    //     enqueueSnackbar(JSON.stringify(event.data), { variant: 'error' })
    //   },
    // } as IAgentPlugin)

    plugins.push({
      eventTypes: ['ev_warn'],
      onEvent: (event, ctx) => {
        enqueueSnackbar(JSON.stringify(event.data), { variant: 'warning' })
      },
    } as IAgentPlugin)

    const agent = createAgent<Agent>({ plugins })
    return {
      ...config,
      agent,
    }
  }

  const JSONToAgentList = (json: string): AgentConfig[] => {
    const serializedAgentList = JSON.parse(json) as Array<SerializedAgentConfig>
    return serializedAgentList.map(deserializeAgentConfig)
  }

  const [agentList, setAgentList] = useState<Array<AgentConfig>>(
    JSONToAgentList(localStorage.getItem('agentList') || '[]'),
  )
  const [activeAgentIndex, setActiveAgentIndex] = useState<number>(
    parseInt(localStorage.getItem('activeAgentIndex') || '0', 10),
  )

  useEffect(() => {
    localStorage.setItem('activeAgentIndex', `${activeAgentIndex}`)
  }, [activeAgentIndex])

  useEffect(() => {
    localStorage.setItem('agentList', agentListToJSON(agentList))
  }, [agentList])

  const addAgent = (agent: AgentConfig) => {
    setAgentList([...agentList, agent])
    enqueueSnackbar('Agent added: ' + agent.name, { variant: 'success' })
  }

  const removeAgent = (index: number) => {
    enqueueSnackbar('Agent removed: ' + agentList[index].name, {
      variant: 'success',
    })
    const newList = [...agentList]
    newList.splice(index, 1)
    setAgentList(newList)
    setActiveAgentIndex(0)
  }

  const addSerializedAgentConfig = (config: SerializedAgentConfig) => {
    addAgent(deserializeAgentConfig(config))
  }

  const openNewAgentModal = (schemaUrl?: string) => {
    setNewAgentSchemaUrl(schemaUrl)
    setNewAgentOpen(true)
  }

  const saveAgentConfig = (config: SerializedAgentConfig) => {
    addSerializedAgentConfig(config)
    setActiveAgentIndex(agentList.length)
    setNewAgentOpen(false)
  }

  return (
    <AgentListContext.Provider
      value={{
        agentList,
        activeAgentIndex,
        defaultDid,
        setDefaultDid,
        setActiveAgentIndex,
        addAgent,
        removeAgent,
        addSerializedAgentConfig,
        openNewAgentModal
      }}
    >
      <AgentProvider agent={agentList[activeAgentIndex]?.agent}>{children}</AgentProvider>
      <NewAgentDialog
        fullScreen={fullScreen}
        open={newAgentOpen}
        onClose={() => setNewAgentOpen(false)}
        schemaUrl={newAgentSchemaUrl}
        saveAgentConfig={saveAgentConfig}
      />
    </AgentListContext.Provider>
  )
}

export const useAgentList = () => useContext(AgentListContext)
export const AgentListConsumer = AgentListContext.Consumer
