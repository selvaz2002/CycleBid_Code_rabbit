import { forwardRef } from 'react'

import TextField from '@mui/material/TextField'

const PickersComponent = forwardRef(({ ...props }, ref) => {
  const { label, readOnly } = props

  return (
    <TextField inputRef={ref} {...props} label={label || ''} {...(readOnly && { inputProps: { readOnly: true } })} />
  )
})

export default PickersComponent
