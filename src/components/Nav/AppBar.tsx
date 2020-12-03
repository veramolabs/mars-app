import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Toolbar, IconButton, AppBar, Typography, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Icon from '@material-ui/icons/RssFeed';
import { useAgent } from "../../agent";
import { useMobile } from './MobileProvider';
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1,
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
    box: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row'
    },
    avatar: {
      height: 24,
      width: 24
    }
  }),
);

export interface Props {
  title?: string
}

const AppBarTabs: React.FC<Props> = props => {
  const { children } = props
  const classes = useStyles();
  const { mobileOpen, setMobileOpen } = useMobile();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const { connection, setConnection, connections } = useAgent()
  const open = Boolean(anchorEl);

  const handleMenu = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <AppBar position="fixed" className={classes.appBar} color={'inherit'}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={()=> setMobileOpen(!mobileOpen)}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap className={classes.title}>
          {props.title}  
        </Typography>

        {connections.length > 1 && <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Icon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                {connections.map(item => (
                  <MenuItem 
                    selected={connection?.url === item.url && connection?.token === item.token}
                    onClick={() => {setConnection(item); handleClose()}}
                  >{item.url}</MenuItem>
                ))}

                
              </Menu>
            </div>}

      </Toolbar>
      {children}
    </AppBar>
  )
}

export default AppBarTabs
