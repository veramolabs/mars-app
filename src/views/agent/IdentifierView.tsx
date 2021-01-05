import React, { useState, useEffect } from 'react'
import { Tabs, Tab } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import Container from '@material-ui/core/Container'
import AppBar from '../../components/nav/AppBar'
import { useAgent } from '../../agent'
import { IdentityProfile } from '../../types'
import CredentialFAB from '../../components/nav/CredentialFAB'
import IdentifierCredentialsView from './Identifier/IdentifierCredentialsView'
import IdentifierProfileView from './Identifier/IdentifierProfileView'

function IdentifierView() {
  const { did: rawDid } = useParams<{ did: string }>()
  const did = decodeURIComponent(rawDid)
  const { agent } = useAgent()
  const [identity, setIdentity] = useState<IdentityProfile | undefined>(undefined)
  const [tab, setTab] = React.useState(0)


  useEffect(() => {
    agent.getIdentityProfile({ did }).then(setIdentity)
  }, [agent, did])

  const handleChange = (event: any, newValue: any) => {
    setTab(newValue)
  }

  return (
    <Container maxWidth="md">
      <AppBar
        title={identity?.name || ''}
        avatar={<Avatar src={identity?.picture} />}
        primary={identity?.name}
        secondary={identity?.nickname}
      >
        {did.substr(0, 3) === 'did' && (
          <Tabs value={tab} onChange={handleChange} indicatorColor="primary" textColor="primary">
            <Tab label={`Profile`} />
            <Tab label={`Credentials`} />
          </Tabs>
        )}
      </AppBar>
      {identity && <CredentialFAB subject={identity.did} />}
      {tab === 0 && <IdentifierProfileView />}
      {tab === 1 && <IdentifierCredentialsView />}
    </Container>
  )
}

export default IdentifierView
