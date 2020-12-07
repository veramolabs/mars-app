import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import MessageCard from '../../components/MessageCard'
import AppBar from "../../components/Nav/AppBar";
import { useAgent } from '../../agent'
import { IMessage } from 'daf-core'

function MessagesView(props: any) {
  const { agent } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ messages, setMessages ] = useState<Array<IMessage>>([])

  useEffect(() => {
    if (agent) {
      setLoading(true)
      agent.dataStoreORMGetMessages({
        order: [
          { column: 'createdAt', direction: 'DESC' }
        ]
      })
      .then(setMessages)
      .finally(() => setLoading(false))
    }
  }, [agent])
  
  return (
    <Container maxWidth="sm">
      <AppBar title='Messages' />
      {loading && <LinearProgress />}
      <Grid container spacing={2} justify="center">
        {messages.map(message => (
          <Grid item key={message.id} xs={12}>
            <MessageCard message={message} type={'summary'}/>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default MessagesView;