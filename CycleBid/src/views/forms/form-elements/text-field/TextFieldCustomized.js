import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { alpha, styled } from '@mui/material/styles'
import MuiInputBase from '@mui/material/InputBase'
import { margin } from '@mui/system'
import { Grid } from '@mui/material'

const InputBase = styled(MuiInputBase)(({ theme }) => ({
  marginTop: theme.spacing(4),
  '& .MuiInputBase-input': {
    fontSize: 16,
    width: '100%',
    borderRadius: 4,
    marginTop: '10px',
    padding: '10px 12px',
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    border: theme.palette.mode === 'light' ? '1px solid #ced4da' : `1px solid ${theme.palette.divider}`,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:focus': {
      borderColor: theme.palette.primary.main,
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`
    }
  }
}))

const TextFieldCustomized = ({ defaultValue, id, label, width, isReadOnly }) => {
  return (
    <Grid container spacing={2} style={{}}>
      <Grid item xs={12} sm={width ? 8 : 6} lg={width ? 8 : 4}>
        <form noValidate autoComplete='off'>
          <FormControl variant='standard' fullWidth>
            <InputLabel
              shrink
              htmlFor='bootstrap-input'
              sx={{ transform: 'translate(0, -4px) scale(0.75)', fontSize: '1.1rem' }}
            >
              {label}
            </InputLabel>
            <InputBase defaultValue={defaultValue} id={id} inputProps={isReadOnly ? { readOnly: true } : {}} />
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}

export default TextFieldCustomized
