import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Toolbar, IconButton, AppBar, Typography, Box, Button, Badge } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import clsx from 'clsx'
import { useMobile } from './MobileProvider'
import { usePresentation } from './PresentationProvider'

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
  const presentation = usePresentation()

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

        {presentation.credentials.length > 0 && <Box marginLeft={1}><Badge color="secondary" badgeContent={presentation.credentials.length}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => presentation.setPresentationOpen(true)}>
            Share
        </Button>
        </Badge></Box>
        }


      </Toolbar>
      {children}
    </AppBar>
  )
}

export default AppBarTabs
