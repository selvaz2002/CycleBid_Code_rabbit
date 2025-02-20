import { Fragment, useState } from 'react'


import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'

import { useSettings } from 'src/@core/hooks/useSettings'

const SnackbarAlert = () => {

  const [open, setOpen] = useState(false)

  const { settings } = useSettings()
  const { skin } = settings

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <Fragment>
      <Button variant='outlined' onClick={handleClick}>
        Open alert snackbar
      </Button>
      <Snackbar open={open} onClose={handleClose} autoHideDuration={3000}>
        <Alert variant='filled' elevation={skin === 'bordered' ? 0 : 3} onClose={handleClose} severity='success'>
          This is a success message!
        </Alert>
      </Snackbar>
    </Fragment>
  )
}

export default SnackbarAlert
