import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { alpha, styled } from '@mui/material/styles'
import { Grid, TextareaAutosize, Typography } from '@mui/material'

const Textarea = styled(TextareaAutosize)(({ theme }) => ({
  fontSize: 16,
  width: '100%',
  borderRadius: 4,
  marginTop: '30px',
  padding: '10px 12px',
  color: 'text.secondary',
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
}))

const TextArea = ({ defaultValue, id, label, instruction, width }) => {
  return (
    <Grid container spacing={2} style={{ paddingTop: '25px' }}>
      <Grid item xs={12} sm={width ? 8 : 8} lg={width ? 8 : 6}>
        <form noValidate autoComplete='off'>
          <FormControl variant='standard' fullWidth>
            <InputLabel
              shrink
              htmlFor='bootstrap-input'
              sx={{ transform: 'translate(0, -4px) scale(0.75)', fontSize: '1.1rem' }}
            >
              {label}
            </InputLabel>
            <Textarea
              defaultValue={defaultValue}
              id={id}
              minRows={4}
              maxRows={6}
              sx={{ lineHeight: '23px !important' }}
            />
          </FormControl>
        </form>
        {instruction && (
          <Typography
            variant='body2'
            sx={{ color: 'text.secondary', marginTop: 2, textAlign: 'right', fontSize: '0.8rem' }}
          >
            {instruction}
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default TextArea
