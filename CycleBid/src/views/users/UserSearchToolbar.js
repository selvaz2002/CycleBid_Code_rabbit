import { useState, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { Toolbar, Button, Checkbox, FormControlLabel, Menu, MenuItem, Typography, Divider, ListItemText, lighten, ClickAwayListener } from '@mui/material'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { format } from 'date-fns'
import { useTheme } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import { getFormattedDateRange } from 'src/@core/utils/dateFormat'

const UserSearchToolbar = ({ statusOptions, roleOptions, handleStatusFilter, handleDateFilter, value, onChange, clearSearch }) => {
  const theme = useTheme()
  const options = useMemo(() => JSON.parse(process.env.NEXT_PUBLIC_DATE_FILTER_OPTIONS || '[]'), [])

  const [statusDialog, setStatusDialog] = useState(null)
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])
  const [selectedOption, setSelectedOption] = useState('All')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateDialog, setDateDialog] = useState(null)
  const [startDateRange, setStartDateRange] = useState(null)
  const [endDateRange, setEndDateRange] = useState(null)
  const [monthsToShow, setMonthsToShow] = useState(2)
  const [popperOffset, setPopperOffset] = useState([300, 0])

  const handleMenuOpen = event => setStatusDialog(event.currentTarget)
  const handleMenuClose = () => setStatusDialog(null)

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)

    if (start && end) {
      handleDateFilter(format(start, 'MM/dd/yyyy'), format(end, 'MM/dd/yyyy'))
      setShowDatePicker(false)
    }
  }

  const handleOptionSelect = option => {
    setSelectedOption(option)
    setDateDialog(null)
    setShowDatePicker(option === 'Custom')

    const today = new Date()
    let start, end

    switch (option) {
      case 'Today':
        start = end = today
        break
      case 'Previous Month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        end = new Date(today.getFullYear(), today.getMonth(), 0)
        break
      case '6 Months':
        start = new Date(today.getFullYear(), today.getMonth() - 6, 1)
        end = new Date(today.getFullYear(), today.getMonth(), 0)
        break
      case '1 Year':
        start = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
        end = today
        break
      case 'All':
        handleDateFilter()
        return
      default:
        return
    }

    setStartDateRange(start)
    setEndDateRange(end)
    handleDateFilter(format(start, 'MM/dd/yyyy'), format(end, 'MM/dd/yyyy'))
  }

  const handleTextFieldClick = event => setDateDialog(event.currentTarget)

  const handleCheckboxChange = status => {
    setSelectedStatuses(prev => prev.includes(status) ? prev.filter(item => item !== status) : [...prev, status])
  }

  const handleRoleboxChange = status => {
    setSelectedRoles(prev => prev.includes(status) ? prev.filter(item => item !== status) : [...prev, status])
  }

  const handleCancel = () => {
    setSelectedStatuses([])
    setSelectedRoles([])
    handleStatusFilter([], [])
    handleMenuClose()
  }

  const handleApply = () => {
    handleStatusFilter(selectedStatuses, selectedRoles)
    handleMenuClose()
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setMonthsToShow(2)
        setPopperOffset([300, 0])
      } else {
        setMonthsToShow(2)
        setPopperOffset([300, 0])
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
        value={value}
        onChange={onChange}
        placeholder='Search User by name, role'
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 2, display: 'flex' }}>
              <Icon icon='mdi:magnify' fontSize={20} />
            </Box>
          ),
          endAdornment: (
            <IconButton size='small' title='Clear' aria-label='Clear' onClick={() => {
              if (typeof clearSearch === 'function' && value) {
                clearSearch();
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
        <ClickAwayListener onClickAway={() => { setShowDatePicker(false), setDateDialog(null) }}>
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
              anchorEl={dateDialog}
              open={Boolean(dateDialog)}
              onClose={() => setDateDialog(null)}
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
                  monthsShown={monthsToShow}
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
                        offset: popperOffset,
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
            anchorEl={statusDialog}
            open={Boolean(statusDialog)}
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
                    label={status}
                  />
                </MenuItem>
              ))}

            <Typography variant='subtitle1' sx={{ textTransform: 'uppercase', fontSize: '15px', margin: '5px' }}>
              By Role
            </Typography>

            {roleOptions &&
              roleOptions.map(role => (
                <MenuItem key={role} value={role}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checkedIcon={<Icon icon='fluent:checkbox-checked-24-filled' width='24' height='24' />}
                        icon={<Icon icon='proicons:checkbox-unchecked' width='24' height='24' />}
                        checked={selectedRoles.includes(role)}
                        onChange={() => handleRoleboxChange(role)}
                        sx={{
                          padding: '2px',

                          '& .MuiSvgIcon-root': {
                            borderRadius: '5px !important',
                            fontSize: '16px'
                          }
                        }}
                      />
                    }
                    label={role}
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

export default UserSearchToolbar