import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import MessageCard from '../../components/cards/MessageCard'
import AppBar from '../../components/nav/AppBar'
import MissingMethodsAlert from '../../components/nav/MissingMethodsAlert'
import { useAgent } from '../../agent'
import { IMessage } from '@veramo/core'
import { useSnackbar } from 'notistack'
import { Alert } from '@material-ui/lab'

function MessagesView(props: any) {
  const { agent } = useAgent()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Array<IMessage>>([])

  useEffect(() => {
    if (agent?.availableMethods().includes('dataStoreORMGetMessages')) {
      setLoading(true)
      agent
        .dataStoreORMGetMessages({
          order: [{ column: 'createdAt', direction: 'DESC' }],
        })
        .then(setMessages)
        .finally(() => setLoading(false))
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    } else {
      setMessages([])
    }
  }, [agent, enqueueSnackbar])

  return (
    <Container maxWidth="md">
      <AppBar title="Messages" />
      {loading && <LinearProgress />}
      <MissingMethodsAlert methods={['dataStoreORMGetMessages']} />
      {!loading && messages.length === 0 && <Alert severity="success">There are no messages</Alert>}
      <Grid container spacing={2} justify="center">
        {messages.map((message) => (
          <Grid item key={message.id} xs={12}>
            <MessageCard message={message} type={'summary'} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default MessagesView
