import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Toolbar, IconButton, AppBar, Typography, Box } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import clsx from 'clsx'
import { useMobile } from './MobileProvider'
const drawerWidth = 312

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
    header: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
    margin: {
      marginLeft: theme.spacing(1),
    },
    avatar: {
      height: 24,
      width: 24,
    },
  }),
)

export interface Props {
  title?: string
  primary?: string
  secondary?: string
  avatar?: React.ReactNode
  button?: React.ReactNode
}

const AppBarTabs: React.FC<Props> = (props) => {
  const { children } = props
  const classes = useStyles()
  const { mobileOpen, setMobileOpen } = useMobile()

  return (
    <AppBar position="fixed" className={classes.appBar} color={'inherit'}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setMobileOpen(!mobileOpen)}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        {props.avatar}
        <Box
          className={clsx(classes.header, {
            [classes.margin]: props.avatar !== undefined,
          })}
        >
          {!props.secondary && (
            <Typography variant="h6" noWrap>
              {props.title}
            </Typography>
          )}
          {props.secondary && props.primary && (
            <Typography variant="body1" noWrap>
              {props.primary}
            </Typography>
          )}
          {props.secondary && props.primary && (
            <Typography variant="body2" color="textSecondary" noWrap>
              {props.secondary}
            </Typography>
          )}
        </Box>
        {props.button}
      </Toolbar>
      {children}
    </AppBar>
  )
}

export default AppBarTabs
