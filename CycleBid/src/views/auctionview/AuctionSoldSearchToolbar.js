import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
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
  ClickAwayListener,
  lighten,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import { format, differenceInCalendarYears, differenceInCalendarMonths, differenceInCalendarDays } from 'date-fns';
import Icon from 'src/@core/components/icon';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import { useTheme } from '@emotion/react';

const AuctionSoldSearchToolbar = (props) => {
  const [startDateRange, setStartDateRange] = useState(null);
  const [endDateRange, setEndDateRange] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const theme = useTheme();

  const options = [
    { value: 'all', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'previous_month', label: 'Previous Month' },
    { value: '6_months', label: '6 Months' },
    { value: '1_year', label: '1 Year' },
    { value: 'custom', label: 'Custom' },
  ];
  const availableStatuses = ['Highest - Low Bid', 'Low - Highest Bid'];

  const handleOnChangeRange = (dates) => {
    const [start, end] = dates;
    setStartDateRange(start);
    setEndDateRange(end);

    if (start && end) {
      const startDate = format(start, 'MM/dd/yyyy');
      const endDate = format(end, 'MM/dd/yyyy');
      setShowDatePicker(false);
      props.handleDateFilter(startDate, endDate);
    }
  };

  const getFormattedDateRange = () => {
    if (!startDateRange || !endDateRange) return 'Date Filter';

    const years = differenceInCalendarYears(endDateRange, startDateRange);
    const months = differenceInCalendarMonths(endDateRange, startDateRange) % 12;
    const days = differenceInCalendarDays(endDateRange, startDateRange) % 30;

    return `${years > 0 ? `${years} year${years > 1 ? 's' : ''}` : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''} ${days > 0 ? `${days} day${days > 1 ? 's' : ''}` : ''}`.trim();
  };

  const handleTextFieldClick = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setAnchorEl1(null);
    setShowDatePicker(option === 'Custom');

    let start, end;
    const today = new Date();

    switch (option) {
      case 'Today':
        start = today;
        end = today;
        break;
      case 'Previous Month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case '6 Months':
        start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case '1 Year':
        start = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        end = today;
        break;
      case 'All':
        props.handleDateFilter();
        return;
      default:
        return;
    }

    setStartDateRange(start);
    setEndDateRange(end);

    if (start && end) {
      const startDate = format(start, 'MM/dd/yyyy');
      const endDate = format(end, 'MM/dd/yyyy');
      props.handleDateFilter(startDate, endDate);
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleCheckboxChange = (status) => {
    setSelectedStatuses([status]);
  };

  const handleCancel = () => {
    setSelectedStatuses([]);
    props.handleApply('');
    handleMenuClose();
  };

  const handleSearchApply = () => {
    props.handleApply(selectedStatuses);
    handleMenuClose();
  };

  return (
    <Box
    sx={{
      gap: 5,
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignSelf: 'center !important',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingTop: { xs: 3, sm: 3, md: 0 }
    }}
  >
    <TextField
      size='small'
      value={props.value}
      onChange={props.onChange}
      placeholder='Search Bike by names'
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
          sm: '0.85'
        },
        '& .MuiInputBase-root > svg': {
          mr: 2
        }
      }}
    />



    <ClickAwayListener onClickAway={() => { setShowDatePicker(false), setAnchorEl1(null) }}>
      <Box>
        <TextField
          value={
            selectedOption === 'Custom'
              ? getFormattedDateRange() || 'Date Filter' // Show formatted date range if "Custom" is selected
              : selectedOption && selectedOption != 'All' ? selectedOption : 'Date Filter'
          }
          onClick={handleTextFieldClick}
          fullWidth
          size="small"
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
          anchorEl={anchorEl1}  open={Boolean(anchorEl1)} onClose={() => setAnchorEl1(null)}>
          {options.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => handleOptionSelect(option.label)}
              sx={{
                backgroundColor: selectedOption === option.label ?  lighten(theme.palette.primary.main,0.7) : 'transparent',
              }}
            >
              <ListItemText><Typography sx={{color: selectedOption === option.label ? theme.palette.primary.main : 'primary.secondary'}}>{option.label}</Typography></ListItemText>
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
        <Typography>Filters</Typography>
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
          BY BID PRICE
        </Typography>

        {availableStatuses.map(status => (
          <MenuItem key={status}>
            <FormControlLabel
              control={
                <Checkbox
                  checkedIcon={<Icon icon="fluent:checkbox-checked-24-filled" width="24" height="24" />}
                  icon={<Icon icon="proicons:checkbox-unchecked" width="24" height="24" />}
                  checked={selectedStatuses.includes(status)}
                  onChange={() => handleCheckboxChange(status)}
                  sx={{
                    padding: '5px',
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
          <Button variant='contained' color='primary' onClick={handleSearchApply}>
            Apply
          </Button>
        </Box>
      </Menu>
    </Toolbar>

  </Box>
  );
};

export default AuctionSoldSearchToolbar;
