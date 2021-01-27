import React from 'react'
import { Grid } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import MessageCard from '../../components/cards/MessageCard'
import AppBar from '../../components/nav/AppBar'
import MissingMethodsAlert from '../../components/nav/MissingMethodsAlert'
import { useAgent, useAgentList } from '../../agent'
import { IMessage } from '@veramo/core'
import { useSnackbar } from 'notistack'
import { Alert } from '@material-ui/lab'
import { useQuery } from 'react-query'

function MessagesView(props: any) {
  const { agent } = useAgent()
  const { activeAgentIndex } = useAgentList()
  const { enqueueSnackbar } = useSnackbar()

  const { isLoading, data } = useQuery<IMessage[], Error>({
    queryKey: ['dataStoreORMGetMessages', activeAgentIndex],
    queryFn: () =>
      agent.dataStoreORMGetMessages({
        order: [{ column: 'createdAt', direction: 'DESC' }],
      }),
    onError: (e) => enqueueSnackbar(e.message, { variant: 'error' }),
  })

  return (
    <Container maxWidth="md">
      <AppBar title="Messages" />
      {isLoading && <LinearProgress />}
      <MissingMethodsAlert methods={['dataStoreORMGetMessages']} />
      {!isLoading && data?.length === 0 && <Alert severity="success">There are no messages</Alert>}
      <Grid container spacing={2} justify="center">
        {data?.map((message) => (
          <Grid item key={message.id} xs={12}>
            <MessageCard message={message} type={'summary'} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default MessagesView
