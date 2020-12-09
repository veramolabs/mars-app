import React, { useState, useContext, useEffect } from "react"
import { AgentProvider } from './AgentProvider'
import { Agent, defaultAgent } from './config'
import { IdentityProfileManager } from "../agent/ProfileManager";
import { createAgent } from "daf-core";
import { AgentRestClient } from "daf-rest";

export interface SerializedAgentConfig {
  name: string
  schemaUrl?: string
  apiUrl?: string
  token?: string
  enabledMethods?: string[]
}

export interface AgentConfig {
  name: string
  agent: Agent
  schemaUrl?: string
  apiUrl?: string
  token?: string
  enabledMethods?: string[]
}

const defaultNamedAgent = { name: 'default', agent: defaultAgent }

export const AgentListContext = React.createContext<{ 
  agentList: Array<AgentConfig>
  activeAgentIndex: number,
  setActiveAgentIndex: (index: number) => void
  addAgent: (agent: AgentConfig) => void
  addSerializedAgentConfig: (config: SerializedAgentConfig) => void
  removeAgent: (index: number) => void
 }>({ 
  agentList: [ defaultNamedAgent ],
  activeAgentIndex: 0,
  setActiveAgentIndex: (index: number) => {},
  addAgent: (agent: AgentConfig) => {},
  addSerializedAgentConfig: (config: SerializedAgentConfig) => {},
  removeAgent: (index: number) => {},
})


const agentListToJSON = (agentList: AgentConfig[]): string => {
  // Removing agent object from serialized config
  return JSON.stringify(agentList.map(c => ({...c, agent: undefined})))
}

const JSONToAgentList = (json: string): AgentConfig[] => {
  const serializedAgentList = JSON.parse(json) as Array<SerializedAgentConfig>
  return serializedAgentList.map(deserializeAgentConfig)
}

const deserializeAgentConfig = (config: SerializedAgentConfig): AgentConfig => {
  const plugins = []

    if (config.apiUrl) {
      const options = {
        url: config.apiUrl,
        enabledMethods: config.enabledMethods || [],
        headers: config.token ? { 'Authorization': 'Bearer ' + config.token} : undefined
      }
      plugins.push(new AgentRestClient(options))
    }
    plugins.push(new IdentityProfileManager())

    const agent = createAgent<Agent>({ plugins })
    return {
      ...config,
      agent
    }
}


export const AgentListProvider: React.FC = ({children}) => {
  const [agentList, setAgentList] = useState<Array<AgentConfig>>(JSONToAgentList(localStorage.getItem('agentList') || '[]'))
  const [activeAgentIndex, setActiveAgentIndex] = useState<number>(parseInt(localStorage.getItem('activeAgentIndex') || '0', 10))

  useEffect(() => {
    localStorage.setItem('activeAgentIndex', `${activeAgentIndex}`)
  }, [activeAgentIndex])

  useEffect(() => {
    localStorage.setItem('agentList', agentListToJSON(agentList))
  }, [agentList])

  const addAgent = (agent: AgentConfig) => {
    setAgentList([ ...agentList, agent ])
  }
  
  const removeAgent = (index: number) => {
    const newList = [...agentList]
    newList.splice(index, 1)
    setAgentList(newList)
  }

  const addSerializedAgentConfig = (config: SerializedAgentConfig) => {
    addAgent(deserializeAgentConfig(config))
  }

  return (
    <AgentListContext.Provider value={{ 
      agentList,
      activeAgentIndex,
      setActiveAgentIndex,
      addAgent,
      removeAgent,
      addSerializedAgentConfig,
      }}>
      <AgentProvider agent={agentList[activeAgentIndex]?.agent}>
        {children}
      </AgentProvider>
    </AgentListContext.Provider>
  )
}

export const useAgentList = () => useContext(AgentListContext);