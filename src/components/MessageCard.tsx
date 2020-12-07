import React, { useState, useEffect } from "react";
import { CardContent, CardHeader, LinearProgress, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionAreaLink from "./Nav/CardActionAreaLink";
import Avatar from '@material-ui/core/Avatar';
import { formatDistanceToNow } from 'date-fns'
import { IdentityProfile } from "../types";
import { useAgent } from '../agent'
// import CredentialCard from "./CredentialCard";
import { IMessage } from "daf-core";
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({

  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },

}));

interface Props {
  message: IMessage
  type: 'summary' | 'details'
}

function MessageCard(props: Props) {
  const { message } = props

  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const { agent, getIdentityProfile } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ from, setFrom ] = useState<IdentityProfile|undefined>(undefined)
  const [ to, setTo ] = useState<IdentityProfile|undefined>(undefined)

  const handleExpandClick = () => {
    setExpanded(!expanded);
  }
  
  useEffect(() => {
    setLoading(true)
    Promise.all<IdentityProfile, IdentityProfile>([
      getIdentityProfile(message.from),
      getIdentityProfile(message.to)
    ])
    .then(profiles => {
      setFrom(profiles[0])
      setTo(profiles[1])
    })
    .finally(() => setLoading(false))
  }, [agent, getIdentityProfile, message])

  if (loading) {
    return (<LinearProgress />)
  }

  return (
    <Card elevation={2}>
      {from && <CardActionAreaLink to={'/identity/' + from.did}>
        <CardHeader
          avatar={
            <Avatar src={from?.picture} />
          }
          title={`From: ${from?.name}`}
          subheader={`${from?.nickname || ''} `}
        />
      </CardActionAreaLink>}
      {to && <CardActionAreaLink to={'/identity/' + to.did}>
        <CardHeader
          avatar={
            <Avatar src={to?.picture} />
          }
          title={`To: ${to?.name}`}
          subheader={`${to?.nickname || ''}`}
        />
      </CardActionAreaLink>}

      <CardActions disableSpacing>
        <Typography variant='body2' color='textPrimary'>
         {message.createdAt && formatDistanceToNow(Date.parse(message.createdAt))} ago, type: {message.type}, Credentials: {message.credentials?.length}, Presentations: {message.presentations?.length}
        </Typography>

        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant='body1'>Message:</Typography>
          <Typography variant='body2'><pre>{JSON.stringify(message,null,2)}</pre></Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default MessageCard;