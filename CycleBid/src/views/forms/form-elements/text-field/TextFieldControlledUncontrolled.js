import { useState } from 'react'

import TextField from '@mui/material/TextField'

const TextFieldControlledUncontrolled = () => {
  const [name, setName] = useState('Cat in the Hat')

  const handleChange = event => {
    setName(event.target.value)
  }

  return (
    <form className='demo-space-x' noValidate autoComplete='off'>
      <TextField value={name} label='Controlled' onChange={handleChange} id='controlled-text-field' />
      <TextField id='uncontrolled-text-field' label='Uncontrolled' defaultValue='foo' />
    </form>
  )
}

export default TextFieldControlledUncontrolled
