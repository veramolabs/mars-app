import React from 'react'
import { Typography, CardContent, Box } from '@material-ui/core'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import { IdentityProfile } from '../../../types'
import IdentityListItemLink from '../../nav/IdentityListItemLink'

interface Props {
  credential: UniqueVerifiableCredential
  issuer: IdentityProfile
  subject?: IdentityProfile
  type: 'summary' | 'details'
}

function MemberCredential(props: Props) {
  const {
    credential: { verifiableCredential },
  } = props
  return (
    <CardContent>
        <Box>
          <Typography variant="body1" color="textSecondary">
            Member Level
          </Typography>
          <Typography variant="h4" color="textPrimary">
            {verifiableCredential.credentialSubject.level}
          </Typography>
          <IdentityListItemLink
            did={verifiableCredential.credentialSubject.id || ''} 
            type='details'
          />
        </Box>

    </CardContent>
  )
}

export default MemberCredential
