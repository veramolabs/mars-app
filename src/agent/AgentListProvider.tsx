import React, { useState, useContext } from "react"
import { AgentProvider } from './AgentProvider'
import { Agent, defaultAgent } from './config'

export interface NamedAgent {
  name: string
  agent: Agent
}

const defaultNamedAgent = { name: 'default', agent: defaultAgent }

export const AgentListContext = React.createContext<{ 
  agentList: Array<NamedAgent>
  activeAgentIndex: number,
  setActiveAgentIndex: (index: number) => void
  addAgent: (agent: NamedAgent) => void
  removeAgent: (index: number) => void
 }>({ 
  agentList: [ defaultNamedAgent ],
  activeAgentIndex: 0,
  setActiveAgentIndex: (index: number) => {},
  addAgent: (agent: NamedAgent) => {},
  removeAgent: (index: number) => {},
})

export const AgentListProvider: React.FC = ({children}) => {
  const [agentList, setAgentList] = useState<Array<NamedAgent>>([ defaultNamedAgent ])
  const [activeAgentIndex, setActiveAgentIndex] = useState<number>(0)

  const addAgent = (agent: NamedAgent) => {
    setAgentList([ ...agentList, agent ])
  }
  
  const removeAgent = (index: number) => {
    setAgentList(agentList.splice(index, 1))
  }

  return (
    <AgentListContext.Provider value={{ 
      agentList,
      activeAgentIndex,
      setActiveAgentIndex,
      addAgent,
      removeAgent,
      }}>
      <AgentProvider agent={agentList[activeAgentIndex].agent}>
        {children}
      </AgentProvider>
    </AgentListContext.Provider>
  )
}

export const useAgentList = () => useContext(AgentListContext);