import { useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridDeleteIcon } from '@mui/x-data-grid'
import QuickSearchToolbar1 from '../data-grid/QuicSearchToolbar1'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material/'

import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Icon } from '@iconify/react'

import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { getInitials } from 'src/@core/utils/get-initials'

import { rows } from 'src/@fake-db/table/static-data1'
import data from 'src/@fake-db/components/data'
import { useFormState } from 'react-hook-form'

const renderClient = params => {
  const { row } = params
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState([])

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
  2: { title: 'Active', color: 'success' },
  3: { title: 'rejected', color: 'error' },
  4: { title: 'Inactive', color: 'warning' },
  5: { title: 'applied', color: 'info' }
}

const columns = [
  {
    flex: 0.25,
    minWidth: 290,
    field: 'full_name',
    headerName: 'User',
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
    flex: 0.2,
    minWidth: 150,
    headerName: 'CONTACT',
    field: 'contact',
    valueGetter: params => new Date(params.value),
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.contact}
      </Typography>
    )
  },
  {
    flex: 0.2,
    minWidth: 110,
    field: 'city',
    headerName: 'LOCATION',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.city}
      </Typography>
    )
  },
  {
    flex: 0.125,
    field: 'role',
    minWidth: 80,
    headerName: 'ROLE',
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.role}
      </Typography>
    )
  },
  {
    flex: 0.175,
    type: 'date',
    minWidth: 120,
    headerName: 'Issue-Date',
    field: 'issue_date',
    valueGetter: params => new Date(params.value),
    renderCell: params => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.issue_date}
      </Typography>
    )
  },

  {
    flex: 0.175,
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
    flex: 0.15,
    minWidth: 120,
    field: 'action',
    headerName: 'Action',
    sortable: false,
    renderCell: params => {
      const [data, setData] = useState(params)

      const [openDialog, setOpenDialog] = useState(false)
      const [selectedRow, setSelectedRow] = useState(null)

      const handleDelete = (id, avatar, name) => {
        setSelectedRow({ id, avatar, name })
        console.log(selectedRow)
        setOpenDialog(true)
      }
      const confirmDelete = () => {
        const updatedData = data.filter(row => row.id - 1 !== selectedRow.id)
        setData(updatedData)
        setSnackbarMessage('User deleted successfully')

        setOpenDialog(false)
      }

      const handleView = () => {
        console.log('View details of row with ID:', params.row.id - 1)
      }

      const cancelDelete = () => {
        setOpenDialog(false)
      }

      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <IconButton
            onClick={() => handleDelete(params.row.id, params.row.avatar, params.row.full_name)}
            aria-label='delete'
          >
            <Icon icon='mingcute:delete-3-line' width='24' height='24' />
          </IconButton>

          <IconButton onClick={handleView} aria-label='delete'>
            <Icon icon='ri:eye-line' width='24' height='24' />
          </IconButton>
          <Dialog open={openDialog} onClose={cancelDelete} maxWidth='sm' fullWidth>
            <DialogTitle sx={{ borderBottom: '2px solid #ddd', paddingBottom: 1, fontWeight: '700' }}>
              Delete User
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '60px' }}>
              <CustomAvatar
                src={`/images/avatars/${selectedRow?.avatar}`}
                sx={{ m: 3, width: '5rem', height: '5rem' }}
              />

              <Typography>
                Are you sure you want to Delete the User{' '}
                <Typography variant='h6' textAlign={'center'}>
                  "{selectedRow?.name}?"
                </Typography>
              </Typography>
            </DialogContent>
            <DialogActions sx={{ borderTop: '2px solid #ddd', paddingTop: '20px', paddingBottom: '20px' }}>
              <Button
                onClick={cancelDelete}
                color='primary'
                sx={{ border: '1px solid', margin: ' 20px 5px', padding: '5px 38px' }}
              >
                No
              </Button>
              <Button
                onClick={confirmDelete}
                color='primary'
                sx={{ border: '1px solid', margin: '20px 5px', padding: '5px 38px' }}
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )
    }
  }
]

const TableSelection = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  return (
    <Card>
      <CardHeader title='Users' sx={{ fontWeight: '700', fontSize: '2rem' }} />
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        checkboxSelection
        disableSelectionOnClick
        slots={{ toolbar: QuickSearchToolbar1 }}
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        slotProps={{
          baseButton: {
            variant: 'outlined'
          },
          toolbar: {
            clearSearch: () => handleSearch(''),
            onChange: event => handleSearch(event.target.value),
            checkboxSelection: false
          }
        }}
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            color: '#333',
            fontWeight: '600',
            fontSize: '0.9rem'
          }
        }}
      />
    </Card>
  )
}

export default TableSelection
