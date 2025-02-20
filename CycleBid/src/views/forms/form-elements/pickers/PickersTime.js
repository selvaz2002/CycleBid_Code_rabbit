import { useState } from 'react'

import Box from '@mui/material/Box'

import DatePicker from 'react-datepicker'

import CustomInput from './PickersCustomInput'

const PickersTime = ({ popperPlacement }) => {
  const [time, setTime] = useState(new Date())
  const [dateTime, setDateTime] = useState(new Date())

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
      <div>
        <DatePicker
          showTimeSelect
          selected={time}
          timeIntervals={15}
          showTimeSelectOnly
          dateFormat='h:mm aa'
          id='time-only-picker'
          popperPlacement={popperPlacement}
          onChange={date => setTime(date)}
          customInput={<CustomInput label='Time Only' />}
        />
      </div>
      <div>
        <DatePicker
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          selected={dateTime}
          id='date-time-picker'
          dateFormat='MM/dd/yyyy h:mm aa'
          popperPlacement={popperPlacement}
          onChange={date => setDateTime(date)}
          customInput={<CustomInput label='Date & Time' />}
        />
      </div>
    </Box>
  )
}

export default PickersTime
