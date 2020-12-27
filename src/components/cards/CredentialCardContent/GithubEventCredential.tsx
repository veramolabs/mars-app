import React from 'react'
import { Typography, CardContent, Box } from '@material-ui/core'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import { IdentityProfile } from '../../../types'

interface Props {
  credential: UniqueVerifiableCredential
  issuer: IdentityProfile
  subject?: IdentityProfile
  type: 'summary' | 'details'
}

function GithubEventCredential(props: Props) {
  const {
    credential: { verifiableCredential },
  } = props
  return (
    <CardContent>
      {verifiableCredential.type.includes('issue_comment') && (
        <Box>
          <Typography variant="body1" color="textPrimary">
            {verifiableCredential.credentialSubject.comment.body}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {verifiableCredential.credentialSubject.issue.title}
          </Typography>
        </Box>
      )}

      {verifiableCredential.type.includes('issues') && (
        <Box>
          <Typography variant="body1" color="textPrimary">
            {verifiableCredential.credentialSubject.issue.title}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {verifiableCredential.credentialSubject.issue.body}
          </Typography>
        </Box>
      )}
    </CardContent>
  )
}

export default GithubEventCredential
