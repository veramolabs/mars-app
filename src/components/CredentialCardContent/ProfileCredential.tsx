import React from "react";
import { Typography, CardContent, Grid } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import { UniqueVerifiableCredential } from "daf-typeorm";
import { IdentityProfile } from "../../types";

interface Props {
  credential: UniqueVerifiableCredential
  issuer: IdentityProfile
  subject?: IdentityProfile
  type: 'summary' | 'details'
}

function ProfileCredential(props: Props) {
  const { credential: { verifiableCredential }, issuer, subject } = props
  
  return (
    <CardContent>
      <Typography variant="body2" color="textSecondary" component="p" gutterBottom>
      {issuer.name} updated profile for {subject?.name}
      </Typography>

      <Grid container spacing={1}>
        {Object.keys(verifiableCredential.credentialSubject).map(type => (
          <Grid item key={type} xs={12} sm={type === 'id' ? 12 : 6}>
            <Typography variant='caption' color='textSecondary'>{type}</Typography>
            {type !== 'picture' && <Typography variant='body2'>{verifiableCredential.credentialSubject[type]}</Typography>}
            {type === 'picture' && <Avatar src={verifiableCredential.credentialSubject[type]}/>}
          </Grid>
        ))}
      </Grid>

    </CardContent>    
  );
}

export default ProfileCredential;