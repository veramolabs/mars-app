import React from 'react'
import { Route, Redirect, Switch, useRouteMatch } from 'react-router-dom'
// import { useAgent } from '../../agent'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import CloudIcon from '@material-ui/icons/Cloud'
import AgentListView from './AgentListView'
import { Box, Divider, List, ListItemIcon, ListItemText } from '@material-ui/core'
import ListItemLink from '../../components/nav/ListItemLink'

const drawerWidth = 312

export function SettingsSwitch(props: any) {
  // const { agent } = useAgent()

  return (
    <Switch>
      <Route exact path="/settings" render={() => <Redirect to="/settings/agents" />} />
      <Route path="/settings/agents" component={AgentListView} />
    </Switch>
  )
}

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

    drawerPaper: {
      width: drawerWidth,
    },
    list: {
      marginTop: -8,
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
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    mainDrawerContent: {
      flexGrow: 1,
    },
    drawerWrapper: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
    },
  }),
)

export function SettingsDrawer(props: any) {
  const classes = useStyles()

  const cloudAgentsMatch = useRouteMatch('/settings/agents')

  return (
    <Box className={classes.mainDrawerContent}>
      <div className={classes.toolbar} />
      <List className={classes.list}>
        <Divider />
        <ListItemLink to={'/settings/agents'} selected={cloudAgentsMatch !== null}>
          <ListItemIcon>
            <CloudIcon />
          </ListItemIcon>
          <ListItemText primary={'Cloud agents'} />
        </ListItemLink>
      </List>
    </Box>
  )
}
