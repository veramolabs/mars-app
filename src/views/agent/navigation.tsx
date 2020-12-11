import React from "react";
import {
  Route,
  Redirect,
  Switch,
  useRouteMatch
} from 'react-router-dom' 
// import { useAgent } from '../../agent'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useAgentList, useAgent } from '../../agent'

import PeopleIcon from '@material-ui/icons/People';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import MessageIcon from '@material-ui/icons/Message';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import DescriptionIcon from '@material-ui/icons/Description';
import ImportIcon from '@material-ui/icons/Backup';


import ImportView from './ImportView'
import Messages from './MessagesView'
import Resolver from './ResolverView'
import Credentials from './CredentialsView'
import Identifiers from './IdentifiersView'
import ManagedIdentities from './ManagedIdentitiesView'
import Identity from './IdentityView'
import Credential from './CredentialView'
import { Box, Divider, List, ListItemIcon, ListItemText, ListSubheader } from "@material-ui/core";
import ListItemLink from "../../components/nav/ListItemLink";

const drawerWidth = 312;

export function AgentSwitch(props: any) {
  // const { agent } = useAgent()
  
  return (
    <Switch>
      <Route exact path="/agent" render={() => <Redirect to="/agent/messages" />} />
      <Route path='/agent/import' component={ImportView} />
      <Route path='/agent/messages' component={Messages} />
      <Route path='/agent/resolver' component={Resolver} />
      <Route path='/agent/credentials' component={Credentials} />
      <Route path='/agent/identifiers' component={Identifiers} />
      <Route path='/agent/managed-identities' component={ManagedIdentities} />
      <Route path='/agent/identity/:did' component={Identity} />
      <Route path='/agent/credential/:hash' component={Credential} />
    </Switch>
  );
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
      flexDirection: 'row'
    },
  }),
);

export function AgentDrawer(props: any) {
  const { agentList, activeAgentIndex } = useAgentList()
  const { agent } = useAgent()
  const classes = useStyles();

  const importMatch = useRouteMatch("/agent/import");
  const messagesMatch = useRouteMatch("/agent/messages");
  const resolverMatch = useRouteMatch("/agent/resolver");
  const credentialsMatch = useRouteMatch("/agent/credentials");
  const identitiesMatch = useRouteMatch("/agent/identifiers");
  const managedIdentitiesMatch = useRouteMatch("/agent/managed-identities");
  const identityMatch = useRouteMatch("/agent/identity/:did");

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
          <Divider/>
          
          {agent?.availableMethods().includes('dataStoreORMGetMessages') && <ListItemLink to={'/agent/messages'} 
            selected={messagesMatch !== null}
            >
            <ListItemIcon><MessageIcon /></ListItemIcon>
            <ListItemText primary={'Messages'} />
          </ListItemLink>}

          {agent?.availableMethods().includes('dataStoreORMGetVerifiableCredentials') && <ListItemLink to={'/agent/credentials'} 
            selected={credentialsMatch !== null}
            >
            <ListItemIcon><VerifiedUserIcon /></ListItemIcon>
            <ListItemText primary={'Credentials'} />
          </ListItemLink>}

          {agent?.availableMethods().includes('dataStoreORMGetIdentities') && <ListItemLink
            to={'/agent/identifiers'}
            selected={identitiesMatch !== null || identityMatch !== null}
            >
            <ListItemIcon><RecentActorsIcon /></ListItemIcon>
            <ListItemText primary={'Known identifiers'} />
          </ListItemLink>}

          {agent?.availableMethods().includes('identityManagerGetIdentities') && <ListItemLink
            to={'/agent/managed-identities'}
            selected={managedIdentitiesMatch !== null}
            >
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary={'Managed identities'} />
          </ListItemLink>}

          {agent?.availableMethods().includes('resolveDid') && <ListItemLink
            to={'/agent/resolver'}
            selected={resolverMatch !== null}
            >
            <ListItemIcon><DescriptionIcon /></ListItemIcon>
            <ListItemText primary={'Resolver'} />
          </ListItemLink>}

          {agent?.availableMethods().includes('handleMessage') && <ListItemLink
            to={'/agent/import'}
            selected={importMatch !== null}
            >
            <ListItemIcon><ImportIcon /></ListItemIcon>
            <ListItemText primary={'Import'} />
          </ListItemLink>}

        </List>
      </Box>
  );
}



