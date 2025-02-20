import { Dialog, DialogContent, Box, Typography, Button } from '@mui/material'
import { Icon } from '@iconify/react'
import React from 'react'

const AlertDialog = ({ open, errorMessage, successMessage, handleClose, navigateToDashboard }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='auction-dialog-title'
      aria-describedby='auction-dialog-description'
      maxWidth='xs'
      sx={{
        '& .MuiPaper-root': {
          borderRadius: '20px',
          width: '400px'
        }
      }}
    >
      <DialogContent>
        {successMessage === '' ? (
          <>
            <Box display='flex' justifyContent='center' marginBottom={10} sx={{ margin: '30px' }}>
              {errorMessage === 'Data not Found' ? (
                <Icon icon='pajamas:warning-solid' width='78' height='78' color='#ffbc11' />
              ) : (
                <Icon icon='ix:error-filled' width='78' height='78' color='red' />
              )}
            </Box>
            <Box textAlign='center' sx={{ marginBottom: '20px' }}>
              <Typography variant='h5' fontWeight='600' marginTop={2} color={'black'} marginBottom={4}>
                {errorMessage === '' ? 'Something Went wrong' : errorMessage}
              </Typography>

              <Button
                variant='contained'
                color='primary'
                onClick={handleClose}
                sx={{
                  margin: '1.5rem',
                  textTransform: 'none',
                  backgroundColor: errorMessage === 'Data not Found' ? '#ffbc11' : 'red',
                  '&:hover': {
                    backgroundColor: errorMessage === 'Data not Found' ? '#ffbc11' : 'red'
                  }
                }}
              >
                {navigateToDashboard ? 'Go to Dashboard' : 'Close'}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box display='flex' justifyContent='center' marginBottom={7} sx={{ margin: '25px' }}>
              <Icon icon='teenyicons:tick-circle-solid' width='78' height='78' color='#5EAC24' />
            </Box>
            <Box textAlign='center' sx={{ marginBottom: '20px' }}>
              <Typography variant='h5' fontWeight='600' marginTop={2} color={'black'} marginBottom={4}>
                {successMessage || 'Operation Successful'}
              </Typography>

              <Button
                variant='contained'
                color='primary'
                onClick={handleClose}
                sx={{ margin: '1.5rem', textTransform: 'none' }}
              >
                {navigateToDashboard ? 'Go to Dashboard' : 'Close'}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AlertDialog
