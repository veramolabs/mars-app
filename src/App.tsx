import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/Add';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { useMobile } from './components/Nav/MobileProvider';
import NewAgentModal from "./components/NewAgentDialog"
import parse from 'url-parse'
import DescriptionIcon from '@material-ui/icons/Description';

import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import {
  Route,
  Redirect,
  Switch,
  useRouteMatch
} from 'react-router-dom' 

import Resolver from './views/Resolver'
import Credentials from './views/Credentials'
import Identifiers from './views/Identifiers'
import ManagedIdentities from './views/ManagedIdentities'
import Identity from './views/Identity'
import Credential from './views/Credential'
import Settings from './views/Settings'
import ListItemLink from './components/Nav/ListItemLink'
import { Avatar, Box, IconButton, ListSubheader, useMediaQuery } from '@material-ui/core';
import { useAgent } from "./agent";
import { AgentConnection } from './types';
import { deepOrange } from '@material-ui/core/colors';

const drawerWidth = 312;

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
      flexDirection: 'row'
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

    }
  }),
);


export default function ResponsiveDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const { connection, connections, setConnection, setConnections } = useAgent()
  const { mobileOpen, setMobileOpen } = useMobile();
  const resolverMatch = useRouteMatch("/resolver");
  const credentialsMatch = useRouteMatch("/credentials");
  const identitiesMatch = useRouteMatch("/identifiers");
  const managedIdentitiesMatch = useRouteMatch("/managed-identities");
  const settingsMatch = useRouteMatch("/settings");
  const identityMatch = useRouteMatch("/identity/:did");

  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [openNewAgentModal, setOpenNewAgentModal] = React.useState(false);

  const saveConnection = ( connection: AgentConnection) => {
    setConnections([...connections, connection])
    setConnection(connection)
    setOpenNewAgentModal(false)
  }

  const handleOpenNewAgentModal = () => {
    setOpenNewAgentModal(true);
  };

  const handleCloseNewAgentModal = () => {
    setOpenNewAgentModal(false);
  };

  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box className={classes.drawerWrapper}>
      <Box className={classes.sideBar}>
      {connections.map((item: AgentConnection) => (
        <IconButton 
          className={classes.connectionButton}
          color="inherit"
          onClick={() => {setConnection(item);}}
          key={item.url}
        >
          <Avatar
            className={connection?.url === item.url && connection?.token === item.token ? classes.orange : classes.purple}
          >{item.url.substr(8,2)}</Avatar>
        </IconButton>
      ))}

      <IconButton 
          className={classes.connectionButton}
          color="inherit"
          onClick={handleOpenNewAgentModal}
      >
        <AddIcon />
      </IconButton>

      <Box className={classes.settings}>
        <ListItemLink
          to={'/settings'}
          selected={settingsMatch !== null}
        >
          <SettingsIcon />
        </ListItemLink>
      </Box>

      </Box>
      <Box className={classes.mainDrawerContent}>
        <div className={classes.toolbar} />
        <List 
          className={classes.list}
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              {parse(connection?.url || '').hostname}
            </ListSubheader>
          }

        >          
          <Divider/>
          <ListItemLink to={'/credentials'} 
            selected={credentialsMatch !== null}
            >
            <ListItemIcon><VerifiedUserIcon /></ListItemIcon>
            <ListItemText primary={'Credentials'} />
          </ListItemLink>
          <ListItemLink
            to={'/identifiers'}
            selected={identitiesMatch !== null || identityMatch !== null}
            >
            <ListItemIcon><RecentActorsIcon /></ListItemIcon>
            <ListItemText primary={'Known identifiers'} />
          </ListItemLink>
          <ListItemLink
            to={'/managed-identities'}
            selected={managedIdentitiesMatch !== null}
            >
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary={'Managed identities'} />
          </ListItemLink>
          <ListItemLink
            to={'/resolver'}
            selected={resolverMatch !== null}
            >
            <ListItemIcon><DescriptionIcon /></ListItemIcon>
            <ListItemText primary={'Resolver'} />
          </ListItemLink>

        </List>
      </Box>
    </Box>
  );

  const container = window.document.body

  if (!connection) {
    return <Settings />
  }

  return (
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
        <NewAgentModal
          fullScreen={fullScreen}
          open={openNewAgentModal}
          onClose={handleCloseNewAgentModal}
          saveConnection={saveConnection}
        />

        <Switch>
          <Route exact path="/" render={() => <Redirect to="/credentials" />} />
          <Route path={'/resolver'} component={Resolver} />
          <Route path={'/credentials'} component={Credentials} />
          <Route path={'/settings'} component={Settings} />
          <Route path={'/identifiers'} component={Identifiers} />
          <Route path={'/managed-identities'} component={ManagedIdentities} />
          <Route path={'/identity/:did'} component={Identity} />
          <Route path={'/credential/:hash'} component={Credential} />
        </Switch>
      </main>
      
    </div>
  );
}