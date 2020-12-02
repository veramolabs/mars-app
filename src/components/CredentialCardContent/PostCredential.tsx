import React from "react";
import { Typography, CardContent, Link, makeStyles } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import { VerifiableCredential } from "daf-core";
import { IdentityProfile } from "../../types";


interface Props {
  credential: VerifiableCredential
  issuer: IdentityProfile
  subject?: IdentityProfile
  type: 'summary' | 'details'
}
const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 16,
    height: 16,
    display: 'inline-block',
  },
  link: {
    display: 'inline-block',
    marginRight: theme.spacing(1)
  }
}));

function PostCredential(props: Props) {
  const { credential, issuer, subject } = props
  const classes = useStyles();
  
  return (
    <CardContent>
      {credential.credentialSubject.comment && 
        <Typography variant='body1' color='textPrimary'>
          {subject && issuer.did !== subject.did && <Link href={'/identity/' + subject.did} className={classes.link}>
            <Avatar variant='rounded' src={subject.picture} className={classes.avatar}/> {subject.nickname}
            </Link>}
          {credential.credentialSubject.comment}
        </Typography>}
        
    </CardContent>    
  );
}

export default PostCredential;