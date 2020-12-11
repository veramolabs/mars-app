import React, { useContext } from 'react'
import { Agent, defaultAgent } from './config'

export const AgentContext = React.createContext<{
  agent: Agent
}>({
  agent: defaultAgent,
})

export const AgentProvider = (props: { children: any; agent: Agent }) => {
  return <AgentContext.Provider value={{ agent: props.agent }}>{props.children}</AgentContext.Provider>
}

export const useAgent = () => useContext(AgentContext)
