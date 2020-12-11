import React from 'react'
import { Typography, CardContent } from '@material-ui/core'
import { UniqueVerifiableCredential } from 'daf-typeorm'
import { IdentityProfile } from '../../../types'

interface Props {
  credential: UniqueVerifiableCredential
  issuer: IdentityProfile
  subject?: IdentityProfile
  type: 'summary' | 'details'
}

function MessageCredential(props: Props) {
  const {
    credential: { verifiableCredential },
  } = props
  return (
    <CardContent>
      {verifiableCredential.credentialSubject.content && (
        <Typography variant="body1" color="textPrimary">
          {verifiableCredential.credentialSubject.content}
        </Typography>
      )}
    </CardContent>
  )
}

export default MessageCredential
