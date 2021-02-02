import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Typography,
} from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { useVeramo } from '@veramo-community/veramo-react'
interface Props {
  fullScreen: boolean
  open: boolean
  onClose: any
  method: string
}

function MethodDialog(props: Props) {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)

  const [args, setArgs] = useState<string>('{}')
  const [result, setResult] = useState<string | undefined>(undefined)
  const { agent } = useVeramo()

  useEffect(() => {
    setArgs('{}')
    setResult(undefined)
  }, [props.method])

  const handleExecute = async () => {
    setLoading(true)

    try {
      const argsObj = JSON.parse(args)
      const r = await agent?.execute(props.method, argsObj)
      setResult(JSON.stringify(r, null, 2))
      enqueueSnackbar('Success', { variant: 'success' })
      setLoading(false)
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
    setLoading(false)
  }

  return (
    <Dialog
      fullScreen={props.fullScreen}
      open={props.open}
      onClose={props.onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{props.method}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {agent?.getSchema()?.components?.methods[props.method]?.description}
        </Typography>
        <TextField
          label="Arguments"
          multiline
          rows={5}
          value={args}
          onChange={(e) => setArgs(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          inputProps={{ style: { fontFamily: 'monospace' } }}
        />
        {loading && <LinearProgress />}
        {result && (
          <TextField
            label="Result"
            multiline
            rows={10}
            value={result}
            onChange={(e) => setArgs(e.target.value)}
            margin="normal"
            fullWidth
            variant="outlined"
            inputProps={{ style: { fontFamily: 'monospace' } }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose} color="default">
          Cancel
        </Button>
        <Button onClick={handleExecute} color="primary" autoFocus>
          Execute
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MethodDialog
