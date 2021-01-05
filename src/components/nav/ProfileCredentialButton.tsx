import React from 'react'
import AddIcon from '@material-ui/icons/Add'
import ProfileDialog from '../../views/agent/dialogs/ProfileDialog'
import { useMediaQuery, Box, Button } from '@material-ui/core'
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
    },
  }),
)

interface Props {
  subject?: string
}

function ProfileCredentialButton(props: Props) {
  const classes = useStyles()
  const theme = useTheme()

  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [openModal, setOpenModal] = React.useState(false)

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  return (
    <Box className={classes.fab}>
      <Button color="primary" onClick={handleOpenModal}>
        <AddIcon />
      </Button>
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

export default ProfileCredentialButton
