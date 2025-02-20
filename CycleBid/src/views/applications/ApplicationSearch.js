import { useState,useMemo } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import {
  Toolbar,
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemText,
  lighten,
  ClickAwayListener
} from '@mui/material'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { format } from 'date-fns'
import { useTheme } from '@mui/material/styles'
import { getFormattedDateRange } from 'src/@core/utils/dateFormat'
import Icon from 'src/@core/components/icon'

const ApplicationSearch = props => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [selectedOption, setSelectedOption] = useState('All')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [anchorEl1, setAnchorEl1] = useState(null)
  const [startDateRange, setStartDateRange] = useState(null)
  const [endDateRange, setEndDateRange] = useState(null)
  const theme = useTheme()

  const { statusOptions, onFilterChange, handleDateFilter } = props
  const options = useMemo(() => JSON.parse(process.env.NEXT_PUBLIC_DATE_FILTER_OPTIONS || '[]'), [])

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const handleOnChangeRange = dates => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)

    if (start && end) {
      const startDate = format(start, 'MM/dd/yyyy')
      const endDate = format(end, 'MM/dd/yyyy')
      setShowDatePicker(false)
      props.handleDateFilter(startDate, endDate)
    }
  }

  const handleOptionSelect = option => {
    setSelectedOption(option)
    setAnchorEl1(null)
    setShowDatePicker(option === 'Custom') 
    var start
    var end
    if (option === 'Today') {
      const today = new Date()
      start = today
      end = today
      setStartDateRange(today)
      setEndDateRange(today)
    } else if (option === 'Previous Month') {
      const today = new Date()
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      setStartDateRange(startOfLastMonth)
      setEndDateRange(endOfLastMonth)
      start = startOfLastMonth
      end = endOfLastMonth
    } else if (option === '6 Months') {
      const today = new Date()
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 6, 1)
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      setStartDateRange(startOfLastMonth)
      setEndDateRange(endOfLastMonth)
      start = startOfLastMonth
      end = endOfLastMonth
    } else if (option === '1 Year') {
      const today = new Date()
      const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
      setStartDateRange(oneYearAgo)
      setEndDateRange(today)
      start = oneYearAgo
      end = today
    } else if (option === 'All') {
      props.handleDateFilter()
      setStartDateRange(null)
      setEndDateRange(null)
    }
    if (start && end) {
      const startDate = format(start, 'MM/dd/yyyy')
      const endDate = format(end, 'MM/dd/yyyy')
      props.handleDateFilter(startDate, endDate)
    }
  }

  const handleTextFieldClick = event => {
    setAnchorEl1(event.currentTarget) 
  }

  const handleCheckboxChange = status => {
    setSelectedStatuses(prev => (prev.includes(status) ? prev.filter(item => item !== status) : [...prev, status]))
  }

  const handleCancel = () => {
    setSelectedStatuses([]) 
    onFilterChange("")
    handleMenuClose()
  }

  const handleApply = () => {
    onFilterChange(selectedStatuses)
    handleMenuClose()
  }

  const displayLabels = {
    draft: 'Draft',
    submitted: 'Submitted',
    inProgress: 'In Progress',
    rejected: 'Rejected'
  };
  const formatStatus = (status) => {
    return displayLabels[status] || status
      .replace(/_/g, ' ') 
      .replace(/-/g, ' ') 
      .replace(/\b\w/g, c => c.toUpperCase());
  };
  return (
    <Box
      sx={{
        gap: 5,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignSelf: 'center !important',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: theme => theme.spacing(5, 5, 4, 5)
      }}
    >
      <TextField
        size='small'
        value={props.value}
        onChange={props.onChange}
        placeholder='Search User'
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 2, display: 'flex' }}>
              <Icon icon='mdi:magnify' fontSize={20} />
            </Box>
          ),
          endAdornment: (
            <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => {
              if (typeof props.clearSearch === 'function' && props.value) {
                props.clearSearch();
              }
            }}>
              <Icon icon='mdi:close' fontSize={20} />
            </IconButton>
          )
        }}
        sx={{
          width: {
            xs: 1,
            sm: '0.5'
          },
          '& .MuiInputBase-root > svg': {
            mr: 2
          }
        }}
      />

      <Box
        sx={{
          gap: 5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignSelf: 'center !important',
          alignItems: 'center',
          justifyContent: 'space-between',

        }}
      >
        <ClickAwayListener onClickAway={() => { setShowDatePicker(false), setAnchorEl1(null) }}>
          <Box sx={{}}>
            <TextField
              value={
                selectedOption === 'Custom'
                  ? getFormattedDateRange() || 'Date Filter' 
                  : selectedOption && selectedOption != 'All' ? selectedOption : 'Date Filter'
              }
              onClick={handleTextFieldClick}
              fullWidth
              size="small"
              sx={{
                width: '200px',
              }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <Box sx={{ marginRight: 2, display: 'flex', alignItems: 'center' }}>
                    <Icon icon="uit:calender" width="24" height="24" />
                  </Box>
                ),
              }}
            />
            <Menu
              anchorEl={anchorEl1}
              open={Boolean(anchorEl1)}
              onClose={() => setAnchorEl1(null)} 
            >
              {options.map((option) => (
                <MenuItem
                  key={option.label}
                  onClick={() => handleOptionSelect(option.label)} 
                  sx={{
                    backgroundColor: selectedOption === option.label ? lighten(theme.palette.primary.main, 0.7) : 'transparent',                   
                  }}
                >
                  <ListItemText><Typography sx={{ color: selectedOption === option.label ? theme.palette.primary.main : 'primary.secondary' }}>{option.label}</Typography></ListItemText>
                </MenuItem>
              ))}
            </Menu>
            {selectedOption === 'Custom' && (
              <DatePickerWrapper sx={{ width: 0, height: 0 }}>
                <DatePicker
                  selectsRange
                  monthsShown={2}
                  endDate={endDateRange}
                  selected={startDateRange}
                  startDate={startDateRange}
                  shouldCloseOnSelect={false}
                  id="date-range-picker-months"
                  onChange={handleOnChangeRange}
                  customInput={<div />} 
                  open={showDatePicker} 
                  popperPlacement="bottom-start" 
                  popperModifiers={[
                    {
                      name: 'preventOverflow',
                      options: {
                        boundary: 'viewport',
                      },
                    },
                    {
                      name: 'offset',
                      options: {
                        offset: [300, 0], 
                      },
                    },
                  ]}
                />
              </DatePickerWrapper>
            )}
          </Box>
        </ClickAwayListener>

        <Toolbar sx={{ paddingLeft: '0 !important', paddingRight: '0 !important', minHeight: '40px' }}>
          <Button
            variant='outlined'
            color='secondary'
            size='small'
            onClick={handleMenuOpen}
            sx={{
              padding: '0px 0px',
              color: 'black',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: '200',
            }}
          >
            <IconButton>
              <Icon icon="material-symbols:tune" width="24" height="24" />
            </IconButton>
            Filters
            <IconButton>
              <Icon icon='iconamoon:arrow-down-2-bold' />
            </IconButton>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { width: 250, padding: '8px' }
            }}
          >
            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase', fontSize: '15px', margin: '5px' }}>
              By status 
            </Typography>
            {statusOptions &&
              statusOptions.map(status => (
                <MenuItem key={status} value={status}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checkedIcon={<Icon icon='fluent:checkbox-checked-24-filled' width='24' height='24' />}
                        icon={<Icon icon='proicons:checkbox-unchecked' width='24' height='24' />}
                        checked={selectedStatuses.includes(status)}
                        onChange={() => handleCheckboxChange(status)}
                        sx={{
                          padding: '2px',

                          '& .MuiSvgIcon-root': {
                            borderRadius: '5px !important',
                            fontSize: '16px'
                          }
                        }}
                      />
                    }
                    label={formatStatus(status)} 
                  />
                </MenuItem>
              ))}

            <Divider />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                paddingTop: 2
              }}
            >
              <Button variant='text' color='primary' sx={{ border: '1px solid' }} onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant='contained' color='primary' onClick={handleApply}>
                Apply
              </Button>
            </Box>
          </Menu>
        </Toolbar>
      </Box>
    </Box>
    
  )
}

export default ApplicationSearch