import { useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

const CheckboxesControlledUncontrolled = () => {
  const [checked, setChecked] = useState(true)

  const handleChange = event => {
    setChecked(event.target.checked)
  }

  return (
    <FormGroup row>
      <FormControlLabel
        label='Controlled'
        control={<Checkbox checked={checked} onChange={handleChange} name='controlled' />}
      />
      <FormControlLabel label='Uncontrolled' control={<Checkbox defaultChecked name='uncontrolled' />} />
    </FormGroup>
  )
}

export default CheckboxesControlledUncontrolled
