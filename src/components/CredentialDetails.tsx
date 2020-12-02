import React from "react";
import { Typography, CardContent, Box } from "@material-ui/core";
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { makeStyles } from '@material-ui/core/styles';
// import RepeatIcon from '@material-ui/icons/Repeat';
import LinearProgress from '@material-ui/core/LinearProgress';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';


interface Props {
  credential: Credential
}

const useStyles = makeStyles((theme) => ({
  icon: {
    height: 12,
    width: 12,
    marginRight: theme.spacing(1)
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

function CredentialDetails(props: Props) {
  const classes = useStyles();
  const { credential } = props



  return (
    <CardContent>

    </CardContent>
  );
}

export default CredentialDetails;