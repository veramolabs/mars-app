import React from 'react'
import { useQuery } from 'react-query'
import { Grid } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import CredentialCard from '../../components/cards/CredentialCard'
import AppBar from '../../components/nav/AppBar'
import { useVeramo } from '@veramo-community/veramo-react'
import { useSnackbar } from 'notistack'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import MissingMethodsAlert from '../../components/nav/MissingMethodsAlert'
import { Alert, ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import ListIcon from '@material-ui/icons/List'
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda'
import TimelineIcon from '@material-ui/icons/Timeline'
import TimelineView from './3d/TimelineView'

function CredentialsView(props: any) {
  const { agent } = useVeramo()
  const { enqueueSnackbar } = useSnackbar()

  const [cardType, setCardType] = React.useState<'summary' | 'details' | 'timeline'>('timeline')

  const { isLoading, data } = useQuery<UniqueVerifiableCredential[], Error>({
    queryKey: ['dataStoreORMGetVerifiableCredentials', agent?.context?.id],
    queryFn: () => {
      if (!agent) throw Error ('no agent')
      return agent.dataStoreORMGetVerifiableCredentials({
        order: [{ column: 'issuanceDate', direction: 'DESC' }],
      })
    },
    onError: (e) => enqueueSnackbar(e.message, { variant: 'error' }),
  })

  return (
    <Container maxWidth="md">
      <AppBar
        title="Credentials"
        button={
          <ToggleButtonGroup
            value={cardType}
            exclusive
            size="small"
            onChange={(event, newCardType) => {
              setCardType(newCardType)
            }}
          >
            <ToggleButton value="summary">
              <ListIcon />
            </ToggleButton>
            <ToggleButton value="details">
              <ViewAgendaIcon />
            </ToggleButton>
            <ToggleButton value="timeline">
              <TimelineIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        }
      />

      {isLoading && <LinearProgress />}
      <MissingMethodsAlert methods={['dataStoreORMGetVerifiableCredentials']} />
      {!isLoading && data?.length === 0 && <Alert severity="success">There are no credentials</Alert>}
      {cardType !== 'timeline' && (
        <Grid container spacing={1} justify="center">
          {data?.map((credential) => (
            <Grid
              item
              key={credential.hash}
              xs={12} //sm={6} md={4} lg={3} xl={2}
            >
              <CredentialCard credential={credential} type={cardType} />
            </Grid>
          ))}
        </Grid>
      )}
      {cardType === 'timeline' && data && <TimelineView credentials={data} />}
    </Container>
  )
}

export default CredentialsView
