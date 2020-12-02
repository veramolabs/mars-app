import React from "react";
import { Typography, CardContent } from "@material-ui/core";
import { VerifiableCredential } from "daf-core";
import { IdentityProfile } from "../../types";

interface Props {
  credential: VerifiableCredential
  issuer: IdentityProfile
  subject?: IdentityProfile
  type: 'summary' | 'details'
}

function MessageCredential(props: Props) {
  const { credential } = props  
  return (
    <CardContent>
      {credential.credentialSubject.content && 
        <Typography variant='body1' color='textPrimary'>
          {credential.credentialSubject.content}
        </Typography>}
    </CardContent>    
  )
}

export default MessageCredential