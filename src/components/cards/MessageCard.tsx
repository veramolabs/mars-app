import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  ListItemIcon,
  ListSubheader,
  Menu,
  MenuItem,
  MenuList,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardActionAreaLink from '../nav/CardActionAreaLink'
import Avatar from '@material-ui/core/Avatar'
import { formatDistanceToNow } from 'date-fns'
import { IdentityProfile } from '../../types'
import { useAgent, useAgentList } from '../../agent'
import { IMessage } from '@veramo/core'
import { makeStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import clsx from 'clsx'
import CredentialCard from './CredentialCard'
import MoreIcon from '@material-ui/icons/MoreVert'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import CodeIcon from '@material-ui/icons/Code'
import { useSnackbar } from 'notistack'
const { blake2bHex } = require('blakejs')

const useStyles = makeStyles((theme) => ({
  more: {
    marginLeft: 'auto',
  },
  expand: {
    transform: 'rotate(0deg)',
    // marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}))

interface Props {
  message: IMessage
  type: 'summary' | 'details'
}

function MessageCard(props: Props) {
  const { message } = props
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)
  const { agentList, activeAgentIndex } = useAgentList()
  const { agent } = useAgent()
  const [loading, setLoading] = useState(false)
  const [from, setFrom] = useState<IdentityProfile | undefined>(undefined)
  const [to, setTo] = useState<IdentityProfile | undefined>(undefined)
  const [showCode, setShowCode] = useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleClickMoreButton = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(message, null, 2)], {
      type: 'text/plain',
    })
    element.href = URL.createObjectURL(file)
    element.download = 'message.txt'
    document.body.appendChild(element) // Required for this to work in FireFox
    element.click()
  }

  const handleMenuItemClick = async (event: any, index: number) => {
    // setSelectedIndex(index);
    try {
      await agentList[index].agent.dataStoreSaveMessage({
        message,
      })
      enqueueSnackbar('Message copied to: ' + agentList[index].name, {
        variant: 'success',
      })
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
    setAnchorEl(null)
  }

  useEffect(() => {
    setLoading(true)
    Promise.all<IdentityProfile, IdentityProfile>([
      agent.getIdentityProfile({ did: message.from }),
      agent.getIdentityProfile({ did: message.to }),
    ])
      .then((profiles) => {
        setFrom(profiles[0])
        setTo(profiles[1])
      })
      .finally(() => setLoading(false))
  }, [agent, message])

  if (loading) {
    return <LinearProgress />
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="body1" color="textPrimary">
          {message.type === 'w3c.vc' ? 'Verifiable credential' : ''}
          {message.type === 'w3c.vp' ? 'Verifiable presentation' : ''}
          {message.type === 'sdr' ? 'Selective disclosure request' : ''}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {message.createdAt && formatDistanceToNow(Date.parse(message.createdAt))} ago
        </Typography>
      </CardContent>

      {from && (
        <CardActionAreaLink to={'/agent/identity/' + from.did}>
          <CardHeader
            avatar={<Avatar src={from?.picture} />}
            title={`From: ${from?.name}`}
            subheader={`${from?.nickname || ''} `}
          />
        </CardActionAreaLink>
      )}
      {to && (
        <CardActionAreaLink to={'/agent/identity/' + to.did}>
          <CardHeader
            avatar={<Avatar src={to?.picture} />}
            title={`To: ${to?.name}`}
            subheader={`${to?.nickname || ''}`}
          />
        </CardActionAreaLink>
      )}

      <CardActions disableSpacing>
        {message.credentials !== undefined && message.credentials.length > 0 && (
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        )}

        <IconButton aria-label="More" className={classes.more} onClick={handleClickMoreButton}>
          <MoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {message.credentials
            ?.map((c) => ({ hash: blake2bHex(c.proof.jwt), verifiableCredential: c }))
            .map((c) => (
              <CredentialCard type="summary" credential={c} />
            ))}
        </CardContent>
      </Collapse>

      <Menu id="lock-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            setShowCode(true)
          }}
        >
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Show source
          </Typography>
        </MenuItem>

        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <DownloadIcon />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Export
          </Typography>
        </MenuItem>

        {agentList.length > 0 && (
          <MenuList
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Copy to
              </ListSubheader>
            }
          >
            {agentList.map((option, index) => (
              <MenuItem
                key={index}
                disabled={
                  !option.agent.availableMethods().includes('dataStoreSaveMessage') ||
                  index === activeAgentIndex
                }
                onClick={(event) => handleMenuItemClick(event, index)}
              >
                <ListItemIcon>
                  <Avatar className={classes.small}>{option.name.substr(0, 2)}</Avatar>
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                  {option.name}
                </Typography>
              </MenuItem>
            ))}
          </MenuList>
        )}
      </Menu>

      <Dialog
        fullScreen={fullScreen}
        open={showCode}
        onClose={() => {
          setShowCode(false)
        }}
        maxWidth="md"
        fullWidth
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Code</DialogTitle>
        <DialogContent>
          <Box fontFamily="Monospace" fontSize="body2.fontSize" m={1}>
            <pre>{JSON.stringify(message, null, 2)}</pre>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              setShowCode(false)
            }}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default MessageCard
