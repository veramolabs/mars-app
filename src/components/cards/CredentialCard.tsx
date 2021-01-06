import React, { useState, useEffect } from 'react'
import {
  CardActions,
  IconButton,
  LinearProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  makeStyles,
  MenuList,
  ListSubheader,
  Box,
  DialogActions,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  ListItem,
  TextField,
} from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardActionAreaLink from '../nav/CardActionAreaLink'
import Avatar from '@material-ui/core/Avatar'
import { formatDistanceToNow } from 'date-fns'
import { UniqueVerifiableCredential } from '@veramo/data-store'
import { IdentityProfile } from '../../types'
import { useAgent, useAgentList } from '../../agent'
import { useSnackbar } from 'notistack'
import PostCredential from './CredentialCardContent/PostCredential'
import ProfileCredential from './CredentialCardContent/ProfileCredential'
import ReactionCredential from './CredentialCardContent/ReactionCredential'
import MessageCredential from './CredentialCardContent/MessageCredential'
import GithubEventCredential from './CredentialCardContent/GithubEventCredential'
import CredentialIcon from '@material-ui/icons/VerifiedUser'
import ProfileIcon from '@material-ui/icons/PermContactCalendar'
import ReactionIcon from '@material-ui/icons/ThumbUp'
import MessageIcon from '@material-ui/icons/Message'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import MoreIcon from '@material-ui/icons/MoreVert'
import QrIcon from '@material-ui/icons/CropFree'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import CodeIcon from '@material-ui/icons/Code'
import LinkIcon from '@material-ui/icons/Link'
import AvatarLink from '../nav/AvatarLink'
import { useCredentialModal } from '../nav/CredentialModalProvider'
import { useIdModal } from '../nav/IdentifierModalProvider'
const QRCode = require('qrcode-react')

interface Props {
  credential: UniqueVerifiableCredential
  type: 'summary' | 'details'
}

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexGrow: 1,
  },
  footerAvatar: {
    display: 'flex',
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginLeft: theme.spacing(1),
  },
  footerDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  footerBottom: {

  },
  icon: {
    // flex: 1
    width: theme.spacing(1.5),
    height: theme.spacing(1.5),
    color: theme.palette.text.secondary,
    marginRight: 3,
  },
  moreButton: {
    // flex: 1
  },
}))

function CredentialPostCard(props: Props) {
  const {
    credential: { verifiableCredential, hash },
  } = props
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { agent } = useAgent()
  const { agentList, activeAgentIndex } = useAgentList()
  const [loading, setLoading] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [issuer, setIssuer] = useState<IdentityProfile>({
    did: verifiableCredential.issuer.id,
  })
  const [subject, setSubject] = useState<IdentityProfile | undefined>(undefined)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const { showCredential } = useCredentialModal()
  const { showDid } = useIdModal()

  const handleClickCopyButton = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = async (event: any, index: number) => {
    // setSelectedIndex(index);
    try {
      await agentList[index].agent.dataStoreSaveVerifiableCredential({
        verifiableCredential,
      })
      enqueueSnackbar('Credential copied to: ' + agentList[index].name, {
        variant: 'success',
      })
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(verifiableCredential, null, 2)], {
      type: 'text/plain',
    })
    element.href = URL.createObjectURL(file)
    element.download = 'credential.txt'
    document.body.appendChild(element) // Required for this to work in FireFox
    element.click()
  }

  useEffect(() => {
    setLoading(true)
    Promise.all<IdentityProfile, IdentityProfile>([
      agent.getIdentityProfile({ did: verifiableCredential.issuer.id }),
      verifiableCredential.credentialSubject.id
        ? agent.getIdentityProfile({
          did: verifiableCredential.credentialSubject.id,
        })
        : Promise.resolve({ did: '' }),
    ])
      .then((profiles) => {
        setIssuer(profiles[0])
        setSubject(profiles[1])
      })
      .finally(() => setLoading(false))
  }, [agent, verifiableCredential])


  let contents
  let Icon = CredentialIcon
  if (verifiableCredential.type.includes('Post')) {
    Icon = MessageIcon
    contents = <PostCredential {...props} issuer={issuer} subject={subject} />
  } else if (verifiableCredential.type.includes('Profile')) {
    Icon = ProfileIcon
    contents = <ProfileCredential {...props} issuer={issuer} subject={subject} />
  } else if (verifiableCredential.type.includes('Reaction')) {
    Icon = ReactionIcon
    contents = <ReactionCredential {...props} issuer={issuer} subject={subject} />
  } else if (verifiableCredential.type.includes('Message')) {
    Icon = MessageIcon
    contents = <MessageCredential {...props} issuer={issuer} subject={subject} />
  } else if (verifiableCredential.type.includes('GitHubEvent')) {
    Icon = MessageIcon
    contents = <GithubEventCredential {...props} issuer={issuer} subject={subject} />
  }

  return (
    <Card elevation={props.type === 'summary' ? 1 : 4}>
      {loading && <LinearProgress />}

      <CardActions disableSpacing>
        <Box className={classes.footer}>
          <AvatarLink
            src={issuer.picture}
            onClick={() => showDid(issuer.did)}
            className={classes.footerAvatar}
          />


          <ListItem button onClick={() => showCredential(hash)} className={classes.footerDetails}>
            <Box className={classes.footerBottom}>
              <Typography noWrap display='block' variant="body2" color="textSecondary" title={issuer.nickname}>
                {issuer.name || issuer.nickname}
              </Typography>

            </Box>
            <Box className={classes.footerBottom}>

              <VerifiedUserIcon fontSize="small" color="disabled" className={classes.icon} />
              <Icon fontSize="small" color="disabled" className={classes.icon} />
              <Typography variant="caption" color="textSecondary">{`${formatDistanceToNow(
                Date.parse(verifiableCredential.issuanceDate),
              )} ago`}</Typography>
            </Box>
          </ListItem>


          <IconButton aria-label="More" className={classes.moreButton} onClick={handleClickCopyButton}>
            <MoreIcon />
          </IconButton>
        </Box>
      </CardActions>
      {props.type === 'details' && <CardActionAreaLink
        onClick={() => showCredential(hash)}
      >
        {contents}
      </CardActionAreaLink>}
      <Menu id="lock-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {verifiableCredential.credentialSubject.id?.substr(0, 4) === 'http' && (
          <MenuItem
            onClick={() => {
              window.document.location.href = verifiableCredential.credentialSubject.id as string
            }}
          >
            <ListItemIcon>
              <LinkIcon />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Open original URL
            </Typography>
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            setShowQr(true)
          }}
        >
          <ListItemIcon>
            <QrIcon />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Show QR Code
          </Typography>
        </MenuItem>

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
                  !option.agent.availableMethods().includes('dataStoreSaveVerifiableCredential') ||
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
        open={showQr}
        onClose={() => {
          setShowQr(false)
        }}
        maxWidth="md"
        fullWidth
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Credential</DialogTitle>
        <DialogContent style={{ display: 'flex', justifyContent: 'center' }}>
          <QRCode value={verifiableCredential.proof['jwt']} size={512} />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              setShowQr(false)
            }}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={showCode}
        onClose={() => {
          setShowCode(false)
        }}
        maxWidth="md"
        fullWidth
        scroll='paper'
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <TextField
            label="Source"
            multiline
            rows={30}
            value={JSON.stringify(verifiableCredential, null, 2)}
            fullWidth
            margin="normal"
            variant="outlined"
            inputProps={{ style: { fontFamily: 'monospace' } }}
          />

        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              setShowCode(false)
            }}
            color="default"
            
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default CredentialPostCard
