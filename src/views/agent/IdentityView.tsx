import React, { useState, useEffect } from 'react'
import {
  Grid,
  Typography,
  makeStyles,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  Box,
  Tabs,
  Tab,
} from '@material-ui/core'
import { useParams } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import clsx from 'clsx'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress'
import CredentialCard from '../../components/cards/CredentialCard'
import ProfileDialog from './dialogs/ProfileDialog'
import AppBar from '../../components/nav/AppBar'
import { UniqueVerifiableCredential } from 'daf-typeorm'
import { useAgent } from '../../agent'
import { IdentityProfile } from '../../types'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 150,
    height: 150,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  collapse: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
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

  container: {
    paddingTop: theme.spacing(6),
  },
}))

function IdentityView(props: any) {
  const { did } = useParams<{ did: string }>()
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)
  const theme = useTheme()
  const { agent } = useAgent()
  const { enqueueSnackbar } = useSnackbar()
  const [identity, setIdentity] = useState<IdentityProfile | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState<Array<UniqueVerifiableCredential>>([])

  const [value, setValue] = React.useState(0)

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue)
  }

  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [openProfileModal, setOpenProfileModal] = React.useState(false)

  const handleOpenProfileModal = () => {
    setOpenProfileModal(true)
  }

  const handleCloseProfileModal = () => {
    setOpenProfileModal(false)
  }

  useEffect(() => {
    agent.getIdentityProfile({ did }).then(setIdentity)
  }, [agent, did])

  useEffect(() => {
    if (agent) {
      setLoading(true)
      agent
        .dataStoreORMGetVerifiableCredentials({
          where: [{ column: value === 0 ? 'issuer' : 'subject', value: [did] }],
        })
        .then(setCredentials)
        .finally(() => setLoading(false))
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    }
  }, [agent, enqueueSnackbar, value, did])

  return (
    <Container maxWidth="sm">
      <AppBar title={identity?.name || ''}>
        <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary">
          <Tab label="Issued" />
          <Tab label="Received" />
        </Tabs>
      </AppBar>
      {loading && <LinearProgress />}
      <Grid container spacing={2} justify="center" className={classes.container}>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent className={classes.header}>
              <Avatar className={classes.avatar} src={identity?.picture} />
              <Typography variant="h5">{identity?.name}</Typography>
              <Typography variant="h6">{identity?.nickname}</Typography>
            </CardContent>
            <CardActions>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box className={classes.collapse}>
                <Typography variant="subtitle2" color="textSecondary">
                  {identity?.did}
                </Typography>
                <Button size="small" color="primary" onClick={handleOpenProfileModal}>
                  Profile
                </Button>
              </Box>
            </Collapse>
          </Card>
        </Grid>

        {credentials.map((credential) => (
          <Grid item key={credential.hash} xs={12}>
            <CredentialCard credential={credential} type="summary" />
          </Grid>
        ))}
      </Grid>
      {identity && (
        <ProfileDialog
          fullScreen={fullScreen}
          open={openProfileModal}
          onClose={handleCloseProfileModal}
          subject={identity.did}
        />
      )}
    </Container>
  )
}

export default IdentityView
