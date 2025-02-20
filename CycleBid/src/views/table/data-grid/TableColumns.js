import { useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid'

import toast from 'react-hot-toast'

import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

import { getInitials } from 'src/@core/utils/get-initials'

import { rows } from 'src/@fake-db/table/static-data'

const renderClient = params => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]
  if (row.avatar.length) {
    return <CustomAvatar src={`/images/avatars/${row.avatar}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar skin='light' color={color} sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}>
        {getInitials(row.full_name ? row.full_name : 'A').slice(0, 2)}
      </CustomAvatar>
    )
  }
}

const statusObj = {
  1: { title: 'current', color: 'primary' },
  2: { title: 'professional', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'resigned', color: 'warning' },
  5: { title: 'applied', color: 'info' }
}

const getFullName = params =>
  toast(
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {renderClient(params)}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
          {params.row.full_name}
        </Typography>
      </Box>
    </Box>
  )

const TableColumns = () => {
  const [hideNameColumn, setHideNameColumn] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })

  const columns = [
    {
      flex: 0.25,
      minWidth: 290,
      field: 'full_name',
      headerName: 'Name',
      renderCell: params => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.full_name}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.175,
      type: 'date',
      minWidth: 120,
      headerName: 'Date',
      field: 'start_date',
      valueGetter: params => new Date(params.value),
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.start_date}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 110,
      field: 'salary',
      headerName: 'Salary',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.salary}
        </Typography>
      )
    },
    {
      flex: 0.1,
      field: 'age',
      minWidth: 80,
      headerName: 'Age',
      renderCell: params => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.age}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: params => {
        const status = statusObj[params.row.status]

        return (
          <CustomChip
            size='small'
            skin='light'
            color={status.color}
            label={status.title}
            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
          />
        )
      }
    },
    {
      flex: 0.125,
      minWidth: 140,
      field: 'actions',
      headerName: 'Actions',
      renderCell: params => {
        return (
          <Button size='small' variant='outlined' color='secondary' onClick={() => getFullName(params)}>
            Get Name
          </Button>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Column'
        action={
          <div>
            <Button size='small' variant='contained' onClick={() => setHideNameColumn(!hideNameColumn)}>
              Toggle Name Column
            </Button>
          </div>
        }
      />
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        initialState={{ columns: { columnVisibilityModel: { full_name: hideNameColumn } } }}
      />
    </Card>
  )
}

export default TableColumns
