import { forwardRef, useState } from 'react'

import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

import format from 'date-fns/format'
import { Line } from 'react-chartjs-2'
import DatePicker from 'react-datepicker'
import { rows } from 'src/@fake-db/table/static-data'


import Icon from 'src/@core/components/icon'


const ChartjsAreaChart = props => {

  const { primary,blue, white, blueLight, greyLight, labelColor, borderColor, legendColor } = props

  const [endDate, setEndDate] = useState(null)
  const [startDate, setStartDate] = useState(null)



  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: -20 },
      backgroundColor: "blue"
    },
    scales: {
      x: {
        grid: {
          color: borderColor
        },
        ticks: { color: labelColor},

      },
      y: {
        min: 0,
        max: 30000,
        grid: {
          color: borderColor
        },
        ticks: {
          stepSize: 10000,
          color: labelColor
        }
      }
    },
    plugins: {
      legend: {
        align: 'start',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: legendColor,
          usePointStyle: true
        }
      },
      tooltip:{
        callbacks: {
          title:(context)=>{
            const dataset=context[0].dataset
            const index=context[0].dataIndex
            const name=dataset.names[index]
            return `${name}`;

          },
          label: (context) => {

            return `salary: ${context.formattedValue}`;


            }
            }

      }
    }
  }

  const Date= rows.slice(0,10).map((client)=>client.start_date)
  const names=rows.slice(0,10).map((client,index)=>client.full_name)
  const datas=rows.slice(0,10).map((client)=>client.salary)

  const data = {
    labels:Date,
    datasets: [
      {
        fill: true,
        tension: 0,
        label: 'salary',
        pointRadius: 0.5,
        pointHoverRadius: 5,
        pointStyle: 'circle',
        names,
        backgroundColor: primary || blue,
        pointHoverBorderWidth: 5,
        borderColor: 'transparent',
        pointHoverBorderColor: white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: blue,
        data:datas
      }
    ]
  }

  const CustomInput = forwardRef((props, ref) => {
    const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return (
      <TextField
        {...props}
        size='small'
        value={value}
        inputRef={ref}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Icon icon='mdi:calendar-outline' />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position='end'>
              <Icon icon='mdi:chevron-down' />
            </InputAdornment>
          )
        }}
      />
    )
  })

  const handleOnChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  return (
    <Card>
      <CardHeader
        title='Data Science'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
        action={
          <DatePicker
            selectsRange
            id='chartjs-area'
            endDate={endDate}
            selected={startDate}
            startDate={startDate}
            onChange={handleOnChange}
            placeholderText='Click to select a date'
            customInput={<CustomInput start={startDate} end={endDate} />}
          />
        }
      />
      <CardContent>
        <Line data={data} height={450} options={options} />
      </CardContent>
    </Card>
  )
}

export default ChartjsAreaChart
