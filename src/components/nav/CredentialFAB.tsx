import React from 'react'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import ProfileDialog from '../../views/agent/dialogs/ProfileDialog'
import { useMediaQuery, Box } from '@material-ui/core'
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(2),
    },
  }),
)

interface Props {
  subject?: string
}

function CredentialFAB(props: Props) {
  const classes = useStyles()
  const theme = useTheme()

  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [openModal, setOpenModal] = React.useState(false)

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  return (
    <Box className={classes.fab}>
      <Fab color="primary" onClick={handleOpenModal}>
        <AddIcon />
      </Fab>
      {openModal && (
        <ProfileDialog
          fullScreen={fullScreen}
          open={openModal}
          onClose={handleCloseModal}
          subject={props.subject}
        />
      )}
    </Box>
  )
}

export default CredentialFAB
