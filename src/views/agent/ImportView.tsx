import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import AppBar from '../../components/nav/AppBar'
import MessageCard from '../../components/cards/MessageCard'
import { useAgent } from '../../agent'
import { Button, ButtonGroup, Card, CardActions, CardContent, Grid, LinearProgress } from '@material-ui/core'

import { useSnackbar } from 'notistack'
import { IMessage } from 'daf-core'
import { DropzoneDialog } from 'material-ui-dropzone'
const QrReader = require('react-qr-reader')

function ImportView(props: any) {
  const { enqueueSnackbar } = useSnackbar()
  const { agent } = useAgent()
  const [loading, setLoading] = useState(false)
  const [showScanner, setShowScanner] = useState<boolean>(false)
  const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false)
  const [data, setData] = useState<string | undefined>(undefined)
  const [importType, setImportType] = useState<string>('')
  const [message, setMessage] = useState<IMessage | undefined>(undefined)

  const handleError = (e: Error) => {
    enqueueSnackbar(e.message, { variant: 'error' })
    setShowScanner(false)
    setData(undefined)
  }

  const handleScan = (result: string) => {
    if (result !== null) {
      setImportType('upload')
      setData(result)
      setShowScanner(false)
    }
  }

  const handleSaveMessage = () => {
    if (message) {
      setLoading(true)
      agent
        .dataStoreSaveMessage({ message })
        .then((e) => enqueueSnackbar('Message saved', { variant: 'success' }))
        .finally(() => {
          setLoading(false)
          setData(undefined)
          setMessage(undefined)
          setImportType('')
        })
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
    }
  }

  const handleImportedData = (imported: string) => {
    try {
      // FIXME
      const obj = JSON.parse(imported)
      if (obj?.proof?.jwt) {
        setData(obj?.proof?.jwt)
      }
    } catch (e) {
      setData(imported)
    }
  }

  const handlePaste = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .readText()
        .then((d) => {
          setImportType('paste')
          handleImportedData(d)
        })
        .catch((e) => enqueueSnackbar(e.message, { variant: 'error' }))
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
    if (data !== undefined) {
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
      <AppBar title="Import" />
      <Grid container spacing={2} justify="center">
        <Grid item xs={12}>
          <Card>
            <CardActions>
              <ButtonGroup variant="text" color="primary" aria-label="contained primary button group">
                <Button
                  onClick={() => {
                    setData(undefined)
                    setShowUploadDialog(true)
                  }}
                >
                  Upload
                </Button>

                <Button
                  onClick={() => {
                    setData(undefined)
                    setShowScanner(true)
                  }}
                >
                  Scan
                </Button>

                <Button onClick={handlePaste}>Paste</Button>
              </ButtonGroup>
            </CardActions>

            {loading && <LinearProgress />}
          </Card>
        </Grid>

        {showScanner && !data && (
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <QrReader delay={300} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />
              </CardContent>
            </Card>
          </Grid>
        )}

        {message && (
          <Grid item xs={12}>
            <MessageCard message={message} type="details" />
            <Button color="primary" variant="contained" onClick={handleSaveMessage}>
              Save message
            </Button>
          </Grid>
        )}
      </Grid>

      <DropzoneDialog
        filesLimit={1}
        cancelButtonText={'Cancel'}
        submitButtonText={'Import'}
        maxFileSize={5000000}
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onSave={handleUpload}
        showPreviews={false}
        showFileNamesInPreview={false}
        showPreviewsInDropzone={true}
      />
    </Container>
  )
}

export default ImportView
