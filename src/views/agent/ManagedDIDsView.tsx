import React from 'react'
import { useQuery } from 'react-query'
import { IconButton, List, useMediaQuery, useTheme } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useAgent, useAgentList } from '../../agent'
import { IIdentifier } from '@veramo/core'
import AppBar from '../../components/nav/AppBar'
import IdentityListItemLink from '../../components/nav/IdentityListItemLink'
import { useSnackbar } from 'notistack'
import AddIcon from '@material-ui/icons/Add'
import NewDIDDialog from './dialogs/NewDIDDialog'
import MissingMethodsAlert from '../../components/nav/MissingMethodsAlert'

function ManagedDIDs(props: any) {
  const { agent } = useAgent()
  const { activeAgentIndex } = useAgentList()
  const { enqueueSnackbar } = useSnackbar()
  const [openNewIdentifierModal, setOpenNewIdentifierModal] = React.useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  const handleOpenNewIdentifierModal = () => {
    setOpenNewIdentifierModal(true)
  }

  const handleCloseNewIdentifierModal = () => {
    setOpenNewIdentifierModal(false)
  }

  const { isLoading, data } = useQuery<IIdentifier[], Error>({
    queryKey: ['didManagerFind', activeAgentIndex],
    queryFn: () => agent.didManagerFind(),
    onError: (e) => enqueueSnackbar(e.message, { variant: 'error' }),
  })

  return (
    <Container maxWidth="md">
      <AppBar
        title="Managed DIDs"
        button={
          <IconButton onClick={handleOpenNewIdentifierModal} aria-label="delete">
            <AddIcon />
          </IconButton>
        }
      />
      {isLoading && <LinearProgress />}
      <MissingMethodsAlert methods={['didManagerFind']} />

      <List>
        {data?.map((identity) => (
          <IdentityListItemLink key={identity.did} did={identity.did} type="summary" />
        ))}
      </List>

      <NewDIDDialog
        fullScreen={fullScreen}
        open={openNewIdentifierModal}
        onClose={handleCloseNewIdentifierModal}
      />
    </Container>
  )
}

export default ManagedDIDs
