import { useState, useEffect } from 'react'

import { Button, Grid, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'

const RadioCustom = ({ buttonData, label, iconDisplay, width, selected, onChange, disabled }) => {
  const [internalSelected, setInternalSelected] = useState(selected)

  useEffect(() => {
    setInternalSelected(selected)
  }, [selected])

  const handleClick = option => {
    if (disabled) return
    setInternalSelected(option)
    onChange(option)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={width ? 12 : 8} lg={width ? 12 : 12}>
        <Typography variant='body2' style={{ marginBottom: '10px', fontSize: '1.1rem !important' }}>
          {label}
        </Typography>

        <Grid container spacing={2}>
          {buttonData?.map((button, index) => (
            <Grid item key={index}>
              <Button
                variant='outlined'
                onClick={() => handleClick(button.value)}
                disabled={disabled}
                style={{
                  backgroundColor: internalSelected === button.value ? 'black' : 'transparent',
                  color: internalSelected === button.value ? 'white' : 'black',
                  border: internalSelected === button.value ? '2px solid black' : '2px solid #ced4da',
                  borderRadius: '20px',
                  textTransform: 'none',
                  opacity: disabled ? 0.5 : 1,
                  pointerEvents: disabled ? 'none' : 'auto'
                }}
                startIcon={
                  internalSelected === button.value && iconDisplay === 'true' ? (
                    <CheckIcon style={{ color: 'white' }} />
                  ) : null
                }
              >
                {button.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default RadioCustom
