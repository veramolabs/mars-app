import React from 'react'
import { Route, Redirect, Switch, useRouteMatch } from 'react-router-dom'
// import { useAgent } from '../../agent'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { useAgentList, useAgent } from '../../agent'

import PeopleIcon from '@material-ui/icons/SupervisorAccount'
import RecentActorsIcon from '@material-ui/icons/RecentActors'
import MessageIcon from '@material-ui/icons/Message'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import DescriptionIcon from '@material-ui/icons/Search'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CodeIcon from '@material-ui/icons/Code'

import ApiView from './ApiView'
import VerifyView from './VerifyView'
import Messages from './MessagesView'
import Resolver from './ResolverView'
import Credentials from './CredentialsView'
import Identifiers from './IdentifiersView'
import ManagedIdentities from './ManagedIdentitiesView'
import Identity from './IdentityView'
import Credential from './CredentialView'
import { Box, Divider, List, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core'
import ListItemLink from '../../components/nav/ListItemLink'

const drawerWidth = 312

export function AgentSwitch(props: any) {
  // const { agent } = useAgent()

  return (
    <Switch>
      <Route exact path="/agent" render={() => <Redirect to="/agent/resolver" />} />
      <Route path="/agent/api" component={ApiView} />
      <Route path="/agent/verify" component={VerifyView} />
      <Route path="/agent/messages" component={Messages} />
      <Route path="/agent/resolver" component={Resolver} />
      <Route path="/agent/credentials" component={Credentials} />
      <Route path="/agent/identifiers" component={Identifiers} />
      <Route path="/agent/managed-identities" component={ManagedIdentities} />
      <Route path="/agent/identity/:did" component={Identity} />
      <Route path="/agent/credential/:hash" component={Credential} />
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

export function AgentDrawer(props: any) {
  const { agentList, activeAgentIndex } = useAgentList()
  const { agent } = useAgent()
  const classes = useStyles()

  const apiMatch = useRouteMatch('/agent/api')
  const importMatch = useRouteMatch('/agent/verify')
  const messagesMatch = useRouteMatch('/agent/messages')
  const resolverMatch = useRouteMatch('/agent/resolver')
  const credentialsMatch = useRouteMatch('/agent/credentials')
  const identitiesMatch = useRouteMatch('/agent/identifiers')
  const managedIdentitiesMatch = useRouteMatch('/agent/managed-identities')
  const identityMatch = useRouteMatch('/agent/identity/:did')

  return (
    <Box className={classes.mainDrawerContent}>
      <div className={classes.toolbar} />
      <List
        className={classes.list}
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            {agentList[activeAgentIndex]?.name}
          </ListSubheader>
        }
      >
        <Divider />

        <ListItemLink
          to={'/agent/resolver'}
          selected={resolverMatch !== null}
          disabled={!agent?.availableMethods().includes('resolveDid')}
        >
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary={'Discover'} />
        </ListItemLink>


        <ListItemLink
          to={'/agent/verify'}
          selected={importMatch !== null}
          disabled={!agent?.availableMethods().includes('handleMessage')}
        >
          <ListItemIcon>
            <CheckCircleIcon />
          </ListItemIcon>
          <ListItemText primary={'Verify'} />
        </ListItemLink>

        <ListItemLink
          to={'/agent/messages'}
          selected={messagesMatch !== null}
          disabled={!agent?.availableMethods().includes('dataStoreORMGetMessages')}
        >
          <ListItemIcon>
            <MessageIcon />
          </ListItemIcon>
          <ListItemText primary={'Messages'} />
        </ListItemLink>

        <ListItemLink
          to={'/agent/credentials'}
          selected={credentialsMatch !== null}
          disabled={!agent?.availableMethods().includes('dataStoreORMGetVerifiableCredentials')}
        >
          <ListItemIcon>
            <VerifiedUserIcon />
          </ListItemIcon>
          <ListItemText primary={'Credentials'} />
        </ListItemLink>

        <ListItemLink
          to={'/agent/identifiers'}
          selected={identitiesMatch !== null || identityMatch !== null}
          disabled={!agent?.availableMethods().includes('dataStoreORMGetIdentifiers')}
        >
          <ListItemIcon>
            <RecentActorsIcon />
          </ListItemIcon>
          <ListItemText primary={'Known identifiers'} />
        </ListItemLink>

        <ListItemLink
          to={'/agent/managed-identities'}
          selected={managedIdentitiesMatch !== null}
          disabled={!agent?.availableMethods().includes('didManagerFind')}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary={'Managed identifiers'} />
        </ListItemLink>




        <ListItemLink to={'/agent/api'} selected={apiMatch !== null}>
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText primary={'API'} />
        </ListItemLink>
      </List>
    </Box>
  )
}
