import { Grid, Typography } from '@mui/material'
import CardSnippet from 'src/@core/components/card-snippet'
import TextareaBasic from 'src/views/forms/form-elements/textarea/TextareaBasic'
import TextareaVariant from 'src/views/forms/form-elements/textarea/TextareaVariant'
import * as source from 'src/views/forms/form-elements/textarea/TextareaSourceCode'

const Textarea = () => {
  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={12}>
        <CardSnippet
          title='Basic Textarea'
          code={{
            tsx: null,
            jsx: source.TextareaBasicJSXCode
          }}
        >
          <Typography sx={{ mb: 4 }}>
            Use <code>minRows</code> prop with <code>TextareaAutosize</code> component to add minimum rows in textarea
            and <code>maxRows</code> prop to add maximum rows.
          </Typography>
          <TextareaBasic />
        </CardSnippet>
      </Grid>
      <Grid item xs={12}>
        <CardSnippet
          title='Variants'
          code={{
            tsx: null,
            jsx: source.TextareaVariantJSXCode
          }}
        >
          <Typography>
            Use <code>multiline</code> prop with <code>TextField</code> component to transform the text field into{' '}
            <code>textarea</code>. Use <code>variant</code> prop with <code>TextField</code> component for different
            variants of textarea.
          </Typography>
          <TextareaVariant />
        </CardSnippet>
      </Grid>
    </Grid>
  )
}

export default Textarea
