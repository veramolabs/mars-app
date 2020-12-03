import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Toolbar, IconButton, AppBar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useMobile } from './MobileProvider';
const drawerWidth = 312;

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

      </Toolbar>
      {children}
    </AppBar>
  )
}

export default AppBarTabs