import React from "react";
import { Typography, CardContent, Link, makeStyles } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import { UniqueVerifiableCredential } from "daf-typeorm";
import { IdentityProfile } from "../../../types";

interface Props {
  credential: UniqueVerifiableCredential
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
  const { credential: { verifiableCredential }, issuer, subject } = props
  const classes = useStyles();
  
  return (
    <CardContent>
      {verifiableCredential.credentialSubject.comment && 
        <Typography variant='body1' color='textPrimary'>
          {subject && issuer.did !== subject.did && <Link href={'/identity/' + subject.did} className={classes.link}>
            <Avatar variant='rounded' src={subject.picture} className={classes.avatar}/> {subject.nickname}
            </Link>}
          {verifiableCredential.credentialSubject.comment}
        </Typography>}
        
    </CardContent>    
  );
}

export default PostCredential;