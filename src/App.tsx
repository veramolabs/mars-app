import React from 'react'
import { useVeramo } from '@veramo-community/veramo-react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import SettingsIcon from '@material-ui/icons/Settings'
import AddIcon from '@material-ui/icons/Add'
import { useMobile } from './components/nav/MobileProvider'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useAgentModal } from './components/nav/AgentModalProvider'
import CredentialModalProvider from './components/nav/CredentialModalProvider'
import IdentifierModalProvider from './components/nav/IdentifierModalProvider'
import OnboardingView from './views/onboarding/OnboardingView'
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles'
import { Route, Redirect, Switch } from 'react-router-dom'

import { AgentSwitch, AgentDrawer } from './views/agent/navigation'
import { SettingsSwitch, SettingsDrawer } from './views/settings/navigation'
import ListItemLink from './components/nav/ListItemLink'
import { Avatar, Box, IconButton } from '@material-ui/core'
import { deepOrange } from '@material-ui/core/colors'
import PresentationProvider from './components/nav/PresentationProvider'

const drawerWidth = 312

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth + 100,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    list: {
      marginTop: -48,
    },
    content: {
      flexGrow: 1,
      paddingTop: theme.spacing(2),
    },
    sideBar: {
      display: 'flex',
      flexDirection: 'column',
      // paddingLeft: theme.spacing(1),
      width: '72px',
      backgroundColor: '#202020',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mainDrawerContent: {
      flexGrow: 1,
    },
    drawerWrapper: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    purple: {
      // color: theme.palette.getContrastText(deepPurple[500]),
      // backgroundColor: deepPurple[500],
    },
    connectionButton: {
      // paddingLeft: theme.spacing(1),
    },
    settings: {
      flexGrow: 1,
      display: 'flex',
      alignItems: 'flex-end',
      paddingBottom: theme.spacing(1),
    },
  }),
)

export default function ResponsiveDrawer() {
  const classes = useStyles()
  const theme = useTheme()
  const { agents, agent, activeAgentId, setActiveAgentId } = useVeramo()
  const { openNewAgentModal } = useAgentModal()
  const { mobileOpen, setMobileOpen } = useMobile()
  const history = useHistory()
  const agentMatch = useRouteMatch("/agent");
  const settingsMatch = useRouteMatch('/settings')

  console.log({activeAgentId, agent, agents})

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box className={classes.drawerWrapper}>
      <Box className={classes.sideBar}>
        {agents.map((item) => (
          <IconButton
            className={classes.connectionButton}
            color="inherit"
            onClick={() => {
              setActiveAgentId(item?.context?.id as string)
              if (!agentMatch) {
                history.push('/agent')
              }
              if (mobileOpen) setMobileOpen(false)
            }}
            key={item?.context.id}
          >
            <Avatar className={item?.context.id === activeAgentId ? classes.orange : classes.purple}>
              {item.context?.name?.substr(0, 2)}
            </Avatar>
          </IconButton>
        ))}

        <IconButton className={classes.connectionButton} color="inherit" onClick={() => openNewAgentModal()}>
          <AddIcon />
        </IconButton>

        <Box className={classes.settings}>
          <ListItemLink to={'/settings'}>
            <SettingsIcon color={settingsMatch !== null ? 'primary' : 'inherit'} />
          </ListItemLink>
        </Box>
      </Box>
      <Switch>
        <Route path={'/agent'} component={AgentDrawer} />
        <Route path={'/settings'} component={SettingsDrawer} />
      </Switch>
    </Box>
  )

  const container = window.document.body

  if (agents.length === 0) {
    return <OnboardingView />
  }

  return (
    <CredentialModalProvider>
      <IdentifierModalProvider>
        <PresentationProvider>
          <div className={classes.root}>
            <CssBaseline />

            <nav className={classes.drawer} aria-label="mailbox folders">
              {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
              <Hidden smUp implementation="css">
                <Drawer
                  container={container}
                  variant="temporary"
                  anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                  open={mobileOpen}
                  onClose={handleDrawerToggle}
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                  ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                  }}
                >
                  {drawer}
                </Drawer>
              </Hidden>
              <Hidden xsDown implementation="css">
                <Drawer
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                  variant="permanent"
                  open
                >
                  {drawer}
                </Drawer>
              </Hidden>
            </nav>
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => <Redirect to={agents.length > 0 ? '/agent' : '/settings'} />}
                />
                <Route path={'/agent'} component={AgentSwitch} />
                <Route path={'/settings'} component={SettingsSwitch} />
              </Switch>
            </main>
          </div>
        </PresentationProvider>
      </IdentifierModalProvider>
    </CredentialModalProvider>
  )
}
