import React, { useState, useEffect } from "react";
import { CardHeader, LinearProgress } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionAreaLink from "./Nav/CardActionAreaLink";
import Avatar from '@material-ui/core/Avatar';
import { formatDistanceToNow } from 'date-fns'
import { VerifiableCredential } from "daf-core";
import { IdentityProfile } from "../types";
import { useAgent } from '../agent'

import PostCredential from "./CredentialCardContent/PostCredential";
import ProfileCredential from "./CredentialCardContent/ProfileCredential";
import ReactionCredential from "./CredentialCardContent/ReactionCredential";
import MessageCredential from "./CredentialCardContent/MessageCredential";

interface Props {
  credential: VerifiableCredential
  type: 'summary' | 'details'
}

function CredentialPostCard(props: Props) {
  const { credential } = props
  const { agent, getIdentityProfile } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ issuer, setIssuer ] = useState<IdentityProfile>({ did: credential.issuer.id })
  const [ subject, setSubject ] = useState<IdentityProfile|undefined>(undefined)
  
  useEffect(() => {
    setLoading(true)
    Promise.all<IdentityProfile, IdentityProfile>([
      getIdentityProfile(credential.issuer.id),
      getIdentityProfile(credential.issuer.id)
    ])
    .then(profiles => {
      setIssuer(profiles[0])
      setSubject(profiles[1])
    })
    .finally(() => setLoading(false))
  }, [agent, getIdentityProfile, credential.issuer.id, credential.credentialSubject.id])

  if (loading) {
    return (<LinearProgress />)
  }

  let contents
  if (credential.type.includes('Post')) {
    contents = (<PostCredential  {...props} issuer={issuer} subject={subject} /> )
  } else if (credential.type.includes('Profile')) {
    contents = (<ProfileCredential  {...props} issuer={issuer} subject={subject} /> )
  } else if (credential.type.includes('Reaction')) {
    contents = (<ReactionCredential  {...props} issuer={issuer} subject={subject} /> )
  } else if (credential.type.includes('Message')) {
    contents = (<MessageCredential  {...props} issuer={issuer} subject={subject} /> )
  } 
  
  return (
    <Card elevation={2}>
      <CardActionAreaLink to={'/identity/' + issuer.did}>
        <CardHeader
          avatar={
            <Avatar src={issuer.picture} />
          }
          title={`${issuer.name}`}
          subheader={`${issuer.nickname} | ${formatDistanceToNow(Date.parse(credential.issuanceDate))} ago`}
        />
      </CardActionAreaLink>
      <CardActionAreaLink to={ props.type === 'summary' ? `${credential.id}`.replace(`${process.env.REACT_APP_HOST}`, '') : '/identity/' + subject?.did}>
        {contents}
      </CardActionAreaLink>
    </Card>
  )
}

export default CredentialPostCard;