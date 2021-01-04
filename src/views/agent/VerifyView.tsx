import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import AppBar from '../../components/nav/AppBar'
import MessageCard from '../../components/cards/MessageCard'
import { useAgent } from '../../agent'
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  TextField,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'

import { useSnackbar } from 'notistack'
import { IMessage } from '@veramo/core'
import { DropzoneDialog } from 'material-ui-dropzone'
import MissingMethodsAlert from '../../components/nav/MissingMethodsAlert'
const QrReader = require('react-qr-reader')

function VerifyView(props: any) {
  const { enqueueSnackbar } = useSnackbar()
  const { agent } = useAgent()
  const [loading, setLoading] = useState(false)
  const [showScanner, setShowScanner] = useState<boolean>(false)
  const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false)
  const [data, setData] = useState<string | undefined>(undefined)
  const [importType, setImportType] = useState<string>('')
  const [input, setInput] = useState<string>('')
  const [message, setMessage] = useState<IMessage | undefined>(undefined)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  const handleError = (e: Error) => {
    enqueueSnackbar(e.message, { variant: 'error' })
    setShowScanner(false)
    setData(undefined)
  }

  const handleScan = (result: string) => {
    if (result !== null) {
      setImportType('scan')
      setData(result)
      setShowScanner(false)
    }
  }

  const handleImportedData = (imported: string) => {
    try {
      // FIXME
      const obj = JSON.parse(imported)
      if (obj?.proof?.jwt) {
        setData(obj?.proof?.jwt)
      }
      if (obj?.raw) {
        setData(obj?.raw)
      }
    } catch (e) {
      setData(imported)
    }
  }

  const handleUpload = (files: File[]) => {
    const reader = new FileReader()
    reader.readAsText(files[0])
    reader.onload = () => {
      setImportType('upload')
      handleImportedData(reader.result?.toString() || '')
      setShowUploadDialog(false)
    }
  }

  useEffect(() => {
    if (agent.availableMethods().includes('handleMessage') && data !== undefined) {
      setLoading(true)
      agent
        .handleMessage({
          raw: data,
          metaData: [{ type: importType }],
          save: false,
        })
        .then(setMessage)
        .finally(() => setLoading(false))
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    }
  }, [agent, data, enqueueSnackbar, importType])

  return (
    <Container maxWidth="sm">
      <AppBar title="Verify" />
      <MissingMethodsAlert methods={['handleMessage']} />

      <Grid container spacing={2} justify="center">
        {message && (
          <Grid item xs={12}>
            <MessageCard message={message} type="details" />
          </Grid>
        )}
        <Grid item xs={12}>
          <Card>
            <CardActions>
              <ButtonGroup variant="text" color="primary" fullWidth>
                <Button
                  onClick={() => {
                    setData(undefined)
                    setShowUploadDialog(true)
                  }}
                >
                  Open file
                </Button>

                <Button
                  onClick={() => {
                    setData(undefined)
                    setShowScanner(true)
                  }}
                >
                  Scan QR Code
                </Button>
              </ButtonGroup>
            </CardActions>

            {loading && <LinearProgress />}
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TextField
                label="Data"
                multiline
                rows={5}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                inputProps={{ style: { fontFamily: 'monospace' } }}
              />
              <Button
                color="primary"
                onClick={() => {
                  setImportType('paste')
                  handleImportedData(input)
                }}
              >
                Verify
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DropzoneDialog
        filesLimit={1}
        dialogTitle="Open file"
        cancelButtonText={'Cancel'}
        submitButtonText={'Verify'}
        maxFileSize={5000000}
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onSave={handleUpload}
        showPreviews={false}
        showFileNamesInPreview={false}
        showPreviewsInDropzone={true}
      />

      <Dialog
        fullScreen={fullScreen}
        open={showScanner}
        onClose={() => {
          setShowScanner(false)
        }}
        maxWidth="md"
        fullWidth
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Scan QR Code</DialogTitle>
        <DialogContent>
          <QrReader delay={300} onError={handleError} onScan={handleScan} style={{ height: '80%' }} />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              setShowScanner(false)
            }}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default VerifyView
