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
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { useMobile } from './components/Nav/MobileProvider';
import { useAgent } from './agent';

import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import {
  Route,
  Redirect,
  Switch,
  useRouteMatch
} from 'react-router-dom' 

import Credentials from './views/Credentials'
import Identifiers from './views/Identifiers'
import ManagedIdentities from './views/ManagedIdentities'
import Identity from './views/Identity'
import Credential from './views/Credential'
import Settings from './views/Settings'
import ListItemLink from './components/Nav/ListItemLink'

const drawerWidth = 240;

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
        marginLeft: drawerWidth,
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
      paddingTop: 0,
    },
    content: {
      flexGrow: 1,
      paddingTop: theme.spacing(2),
    },
  }),
);


export default function ResponsiveDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const { connection } = useAgent()
  const { mobileOpen, setMobileOpen } = useMobile();
  const credentialsMatch = useRouteMatch("/credentials");
  const identitiesMatch = useRouteMatch("/identifiers");
  const managedIdentitiesMatch = useRouteMatch("/managed-identities");
  const settingsMatch = useRouteMatch("/settings");
  const identityMatch = useRouteMatch("/identity/:did");
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List className={classes.list}>
      <Divider />
        
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
          to={'/settings'}
          selected={settingsMatch !== null}
          >
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary={'Settings'} />
        </ListItemLink>

      </List>
    </div>
  );

  const container = window.document.body
  console.log({connection})
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
        
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/credentials" />} />
          <Route path={'/credentials'} component={Credentials} />
          <Route path={'/settings'} component={Settings} />
          <Route path={'/identifiers'} component={Identifiers} />
          <Route path={'/managed-identities'} component={ManagedIdentities} />
          <Route path={'/identity/:did'} component={Identity} />
          <Route path={'/c/:id'} component={Credential} />
        </Switch>
      </main>
    </div>
  );
}