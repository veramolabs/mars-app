import React, { useEffect, useState } from 'react'
import { Typography, CardContent, makeStyles, Card, Box, Avatar } from '@material-ui/core'
import { UniqueVerifiableCredential } from 'daf-typeorm'
import { IdentityProfile } from '../../../types'
import { useAgent } from '../../../agent'

interface Props {
  credential: UniqueVerifiableCredential
  issuer: IdentityProfile
  subject?: IdentityProfile
  type: 'summary' | 'details'
}

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
    // padding: theme.spacing(2)
  },
  author: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  authorAvatar: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  emoji: {
    marginRight: theme.spacing(2),
  },
  message: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: theme.spacing(1),
  },
}))

function ReactionCredential(props: Props) {
  const {
    credential: { verifiableCredential },
  } = props
  const classes = useStyles()
  const { agent } = useAgent()
  const [author, setAuthor] = useState<IdentityProfile | undefined>(undefined)

  useEffect(() => {
    if (verifiableCredential?.credentialSubject?.message?.author) {
      agent
        .getIdentityProfile({ did: verifiableCredential?.credentialSubject?.message?.author })
        .then(setAuthor)
    }
  }, [agent, verifiableCredential])

  return (
    <CardContent className={classes.content}>
      {verifiableCredential.credentialSubject.emoji && (
        <Box className={classes.emoji}>
          <Typography variant="h2" color="textPrimary">
            {verifiableCredential.credentialSubject.emoji}
          </Typography>
        </Box>
      )}

      {verifiableCredential.credentialSubject.message && (
        <Card variant="outlined" className={classes.message}>
          <Box className={classes.message}>
            {verifiableCredential.credentialSubject.message.content && (
              <Typography variant="body1" color="textPrimary">
                {verifiableCredential.credentialSubject.message.content}
              </Typography>
            )}
            {verifiableCredential.credentialSubject.message.channel && (
              <Box>
                <Box className={classes.author}>
                  <Avatar src={author?.picture} className={classes.authorAvatar} />
                  <Typography variant="body2" color="textSecondary" title={author?.nickname}>
                    {author?.name} #{verifiableCredential.credentialSubject.message.channel.name}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Card>
      )}
    </CardContent>
  )
}

export default ReactionCredential
