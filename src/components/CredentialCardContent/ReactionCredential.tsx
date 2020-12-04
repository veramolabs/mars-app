import React from "react";
import { Typography, CardContent } from "@material-ui/core";
import { UniqueVerifiableCredential } from "daf-typeorm";
import { IdentityProfile } from "../../types";

interface Props {
  credential: UniqueVerifiableCredential
  issuer: IdentityProfile
  subject?: IdentityProfile
  type: 'summary' | 'details'
}

function ReactionCredential(props: Props) {
  const { credential: {verifiableCredential} } = props
  return (
    <CardContent>
      {verifiableCredential.credentialSubject.emoji && 
        <Typography variant='h3' color='textPrimary'>
          {verifiableCredential.credentialSubject.emoji}
        </Typography>}      
    </CardContent>    
  )
}

export default ReactionCredential