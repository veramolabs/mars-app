import React from 'react'
import { useAgent } from '../../agent'
import { Alert } from '@material-ui/lab'

interface Props {
  methods: string[]
}

function MissingMethodsAlert(props: Props) {
  const { methods } = props
  const { agent } = useAgent()
  const availableMethods = agent.availableMethods()
  const unavailableMethods: string[] = []
  methods.forEach(method => {
    if (!availableMethods.includes(method)) {
      unavailableMethods.push(method)
    }
  })

  if (unavailableMethods.length > 0) {
    return (
      <Alert severity="error"> Missing methods: {unavailableMethods.join(', ')}</Alert>
    )
  } else {
    return null
  }
}

export default MissingMethodsAlert
