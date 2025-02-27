import { useState } from 'react'

import Box from '@mui/material/Box'

import subDays from 'date-fns/subDays'
import addDays from 'date-fns/addDays'
import DatePicker from 'react-datepicker'

import CustomInput from './PickersCustomInput'

const PickersCustomization = ({ popperPlacement }) => {
  const [dateFormat, setDateFormat] = useState(new Date())
  const [dateHighlight, setDateHighlight] = useState(new Date())

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
      <div>
        <DatePicker
          id='custom-format'
          selected={dateFormat}
          dateFormat='MMMM d, yyyy h:mm aa'
          popperPlacement={popperPlacement}
          onChange={date => setDateFormat(date)}
          customInput={<CustomInput label='Custom Date Format' />}
        />
      </div>
      <div>
        <DatePicker
          id='highlight-dates'
          selected={dateHighlight}
          popperPlacement={popperPlacement}
          onChange={date => setDateHighlight(date)}
          customInput={<CustomInput label='Highlight Dates' />}
          highlightDates={[subDays(new Date(), 7), addDays(new Date(), 7)]}
        />
      </div>
    </Box>
  )
}

export default PickersCustomization
