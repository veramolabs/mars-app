import React from 'react'
import { Typography, CardContent, makeStyles } from '@material-ui/core'
import { UniqueVerifiableCredential } from 'daf-typeorm'
import { IdentityProfile } from '../../../types'

interface Props {
  credential: UniqueVerifiableCredential
  issuer: IdentityProfile
  subject?: IdentityProfile
  type: 'summary' | 'details'
}

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // padding: theme.spacing(2)
  },
}))

function ReactionCredential(props: Props) {
  const {
    credential: { verifiableCredential },
  } = props
  const classes = useStyles()

  return (
    <CardContent className={classes.content}>
      {verifiableCredential.credentialSubject.emoji && (
        <Typography variant="h3" color="textPrimary">
          {verifiableCredential.credentialSubject.emoji}
        </Typography>
      )}
    </CardContent>
  )
}

export default ReactionCredential
