import React from "react";
import { Typography, CardContent, makeStyles } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import { UniqueVerifiableCredential } from "daf-typeorm";
import { IdentityProfile } from "../../types";

interface Props {
  credential: UniqueVerifiableCredential
  issuer: IdentityProfile
  subject?: IdentityProfile
  type: 'summary' | 'details'
}

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 50,
    height: 50
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2)
  },
}));

function ProfileCredential(props: Props) {
  const { credential: { verifiableCredential } } = props
  const classes = useStyles();

  return (
    <CardContent className={classes.content}>
      <Avatar
        className={classes.avatar}
        src={verifiableCredential.credentialSubject.picture}
        />
      <Typography variant='subtitle1'>{verifiableCredential.credentialSubject.name}</Typography>
      <Typography variant='subtitle2' color='textSecondary'>{verifiableCredential.credentialSubject.nickname}</Typography>

    </CardContent>    
  );
}

export default ProfileCredential;