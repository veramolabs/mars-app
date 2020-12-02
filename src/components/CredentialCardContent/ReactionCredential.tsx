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

function ReactionCredential(props: Props) {
  const { credential } = props
  return (
    <CardContent>
      {credential.credentialSubject.emoji && 
        <Typography variant='body1' color='textPrimary'>
          {credential.credentialSubject.emoji}
        </Typography>}      
    </CardContent>    
  )
}

export default ReactionCredential