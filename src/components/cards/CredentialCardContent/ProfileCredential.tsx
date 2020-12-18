import React from 'react'
import { Typography, CardContent, makeStyles, Box } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import { IdentityProfile } from '../../../types'

interface Props {
  credential: UniqueVerifiableCredential
  issuer: IdentityProfile
  subject?: IdentityProfile
  type: 'summary' | 'details'
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 100,
    height: 100,
    marginRight: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(2),
    overflowWrap: 'anywhere',
  },
  picture: {},

  row: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(2),
  },
}))

function ProfileCredential(props: Props) {
  const {
    credential: { verifiableCredential },
  } = props
  const classes = useStyles()

  return (
    <CardContent className={classes.content}>
      <Typography variant="body1" color="textPrimary">
        Contact information
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {verifiableCredential.credentialSubject.id}
      </Typography>
      <Box className={classes.row}>
        {verifiableCredential.credentialSubject.picture && (
          <Avatar
            variant="rounded"
            className={classes.avatar}
            src={verifiableCredential.credentialSubject.picture}
          />
        )}
        <Box>
          {Object.keys(verifiableCredential.credentialSubject)
            .filter((t) => !['picture', 'id'].includes(t))
            .map((type) => (
              <Box key={type}>
                <Typography variant="caption" color="textSecondary">
                  {type}
                </Typography>
                <Typography variant="body1">{verifiableCredential.credentialSubject[type]}</Typography>
              </Box>
            ))}
        </Box>
      </Box>
    </CardContent>
  )
}

export default ProfileCredential
