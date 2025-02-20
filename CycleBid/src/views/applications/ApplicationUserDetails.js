
import { useEffect, useState } from 'react'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled, alpha } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTabList from '@mui/lab/TabList'
import Icon from 'src/@core/components/icon'
import {
  Button,
  Grid,
  Dialog,
  DialogContent,
  Select,
  MenuItem,
} from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import TextFieldCustomized from 'src/views/forms/form-elements/text-field/TextFieldCustomized'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Textarea from 'src/views/forms/form-elements/text-field/TextArea'
import RadioCustom from 'src/views/forms/form-elements/radio/RadioCustom'
import { Box } from '@mui/system'
import VideoGallery from '../components/images/videoGallery'
import { lighten } from '@mui/system'
import ImageTab from '../components/images/imageTab'
import 'react-datepicker/dist/react-datepicker.css'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CircularProgress from '@mui/material/CircularProgress'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
import { Label } from 'recharts'
import axiosInstanceNew from 'src/axiosInstanceNew'
import axios from 'axios'
import { Router, useRouter } from 'next/router'
import AlertDialog from 'src/@core/utils/alertDialog'

const TabList = styled(MuiTabList)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: lighten(theme.palette.primary.main, 0.8),
    color: `${theme.palette.primary.main} !important`
  },
  '& .MuiTab-root': {
    minHeight: 38,
    minWidth: 110,
    borderRadius: 8,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginRight: theme.spacing(5)
  },
  '& .tabStyle': {
    textTransform: 'none',
    fontSize: '16px'
  }
}))

const ApplicationUserDetails = ({ ids, userData }) => {
  const router = useRouter();
  const [selectState, setSelectState] = useState('')
  const [selectCity, setSelectCity] = useState('')
  const [stateNames, setStateNames] = useState([])
  const [cityNames, setCityNames] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ bidPrice: false, bidEndDate: false })
  const [rejectSuccess, setRejectSuccess] = useState(false)
  const [rejectFailure, setRejectFailure] = useState(false)
  const [rejectLoading, setRejectLoading] = useState(false)

  useEffect(() => {
    formData()
  }, [])
  const handleCancel = () => {
    setOpen(false)
  }
  const handleSelectCity = e => {
    setSelectCity(e.target.value)
  }
  const handleSelectState = (e) => {
    const selectedState = e.target.value;
    setSelectState(selectedState);
    cityData(selectedState);
  };

  const formData = async () => {
    try {
      const data = await axiosInstanceNew.get('get-locations?countryId=678bfb001484b4294f28313d');
      setStateNames(data.data);
      const defaultStateId = userData?.bikeDetails?.city?.stateId || data.data[0]._id;
      setSelectState(defaultStateId);
      await cityData(defaultStateId);
      if (userData?.bikeDetails?.city?._id) {
        setSelectCity(userData?.bikeDetails.city._id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Error fetching data');
    }
  };

  const cityData = async (stateId) => {
    try {
      const data = await axiosInstanceNew.get(`get-locations?stateId=${stateId}`);
      setCityNames(data.data);
      setSelectCity(data.data[0]._id);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Error fetching data');
    }
  };
  const [value, setValue] = useState('1')
  const [showApprovalTab, setShowApprovalTab] = useState(false)
  const totalPages = 4
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const handleOpenApprovalTab = () => {
    setShowApprovalTab(true);
    setValue('5');
  };

  const handleNext = () => {
    const nextValue = (parseInt(value) + 1).toString()
    setValue(nextValue > '4' ? '1' : nextValue)
  }
  const handleBack = () => {
    if (value > 1) {
      setValue(String(Number(value) - 1))
    }
  }

  const handleDelete = () => { }

  const [open, setOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [failureOpen, setFailureOpen] = useState(false)
  useEffect(() => {
    if (successOpen || failureOpen) {
      setOpen(false)
    }
  }, [successOpen, failureOpen])
  const handleClick = async () => {
    let validationErrors = {};
    if (!bidPrice) {
      validationErrors.bidPrice = "Bid-Price fields is required";
    }
    if (!bidEndDate) {
      validationErrors.bidEndDate = "Bid-End date field is required"
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const parsedDate = dayjs(bidEndDate);
    const formattedBidDate = parsedDate.utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const data = {
      motorcycleId: ids,
      bidPrice: bidPrice,
      bidEndingOn: formattedBidDate,
      isFeatured: isFeatured.toLowerCase() == 'yes' ? true : false,
      mode: 'create',
      bearerToken: `Bearer ${localStorage.getItem('accessToken')}`,
    }
    setLoading(true)
    try {
      const response = await axiosInstanceNew.post("/auction", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });      
      if (response.status == 'error') {
        setErrorMessage(response.message)
        setValue('failureTab');
        setBidEndDate('')
      }
      else {
        setValue('successTab');
        setBidEndDate('')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error?.response?.data?.message || "Something Went Wrong"
        setErrorMessage(apiError)
      }
      console.error(error)
      setFailureOpen(true)
      setBidEndDate('')
    } finally {
      setLoading(false)
    }
  }
  const [bidPrice, setBidPrice] = useState('100')
  const [bidEndDate, setBidEndDate] = useState(dayjs().add(30, 'day').add(5, 'hours').add(30, 'minutes'))
  const [isFeatured, setIsFeatured] = useState('No')
  const disablePastDates = (date) => {
    return date.isBefore(dayjs(), 'day');
  };
  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setOpen(false)
    setSuccessOpen(false)
    router.replace("/dashboard")
    setFailureOpen(false)
    setRejectFailure(false)
    setRejectSuccess(false)
  }

  const localTimezone = dayjs.tz.guess();
  const handleDateChange = (newDate) => {
    setBidEndDate(newDate.tz(localTimezone, true));
  };

  const handleReject = async () => {
    setRejectLoading(true)
    try {
      const formData = new FormData();
      formData.append('data', `{\n  "id": "${ids}",\n  "step": 6,\n  "status": "rejected"\n}`);
      const response = await axiosInstanceNew.post("/sell-motorcycle", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
      })
      if (response.status === 'success') {
        setRejectSuccess(true)
      }
      else {
        setRejectFailure(true)
        setErrorMessage(response?.message ?? "Rejected Unsuccessfully")
      }
    }
    catch (e) {
      console.error(e)
      setRejectFailure(true)
      setErrorMessage("Something Went Wrong")
    }
    finally {
      setRejectLoading(false)
    }
  }

  const handleFeaturedChange = newValue => {
    setIsFeatured(newValue)
  }
  const defaultButtonData = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ];

  const saleElsewhere = userData?.bikeDetails?.saleElsewhere;
  const selectedSaleElsewhere = saleElsewhere ? 'Yes' : 'No';
  const defaultSellerType = userData?.userDetails?.sellerType || 'Dealer';
  const buttonData = [
    { label: 'Dealer', value: 'Dealer' },
    { label: 'Private Party', value: 'Private Party' }
  ];
  const hasFlaws = userData?.bikeDetails?.hasFlaws ?? 'No';
  const selectedHasFlaws = hasFlaws ? 'Yes' : 'No';
  const reservePriceRequired = userData?.bikeDetails?.reservePriceRequired;
  const selectedReservePrice = reservePriceRequired === true ? 'Yes' : reservePriceRequired === false ? 'No' : 'No';
  return (
    <TabContext value={value}>
      {!["5", "successTab", "failureTab"].includes(value) && (
        <TabList
          variant='scrollable'
          onChange={handleChange}
          aria-label='customized tabs example'
          sx={{
            backgroundColor: 'grey.100',
            padding: '30px 20px'
          }}
        >
          <Tab
            value='1'
            label='User Details'
            className='tabStyle'
            icon={<Icon icon='ri:group-line' />}
            iconPosition='start'
          />
          <Tab
            value='2'
            label='Vehicle Details'
            className='tabStyle'
            icon={<Icon icon='circum:lock' />}
            iconPosition='start'
          />
          <Tab
            value='3'
            label='Photos'
            className='tabStyle'
            icon={<Icon icon='mynaui:location' />}
            iconPosition='start'
          />
          <Tab
            value='4'
            label='Videos'
            className='tabStyle'
            icon={<Icon icon='ri:notification-line' />}
            iconPosition='start'
          />

        </TabList>
      )}

      <TabPanel value='1' sx={{ padding: 8, paddingTop: 0 }}>
        <br></br>
        <TextFieldCustomized
          defaultValue={userData?.userDetails?.fullName || '-'}
          id='name'
          label='What your Full Name?*'
        />
        <br></br>
        <TextFieldCustomized
          defaultValue={userData?.userDetails?.contactNumber || '-'}
          id='name'
          label='Contact Number*'
        />
        <br></br>
        <RadioCustom
          buttonData={buttonData}
          label='Dealer OR Private Party'
          iconDisplay='true'
          selected={defaultSellerType}
          onChange={value => { }}
        />
      </TabPanel>

      <TabPanel value='2' sx={{ padding: 8, paddingTop: 0 }}>
        <br></br>
        <Typography variant='body2'>Your Country Name?</Typography>
        <Button sx={{ border: "1px solid black", marginBottom: "15px", background: "black", color: "white", marginTop: "10px" }}>
          USA
        </Button>
        <br></br>
        <Typography>Your State Name?</Typography>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={selectState}
          sx={{ width: "33%", height: "50px", margin: "10px 0" }}
          onChange={handleSelectState}
        >
          {stateNames.map((state) => (
            <MenuItem key={state._id} value={state._id}>
              {state.name}
            </MenuItem>
          ))}
        </Select>
        <br></br>
        <Typography>Your City Name?</Typography>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={selectCity}
          sx={{ width: "33%", height: "50px", margin: "10px 0" }}
          onChange={handleSelectCity}
        >
          {cityNames.map((city) => (
            <MenuItem key={city} value={city._id}>
              {city.name}
            </MenuItem>
          ))}
        </Select>
        <br></br>
        <TextFieldCustomized defaultValue="123-456" id='name' label='Your Postal code?' />
        <br></br>
        <TextFieldCustomized defaultValue={userData?.bikeDetails?.vin || '-'} id='name' label='What is the vechicle VIN Number?*' />
        <br></br>
        <TextFieldCustomized defaultValue={userData?.bikeDetails?.year || '-'} id='name' label='What year is your vechicle?' />
        <br></br>
        <TextFieldCustomized defaultValue={userData?.bikeDetails?.model || '-'} id='name' label='What model is this vechicle?' />
        <br></br>
        <TextFieldCustomized defaultValue={userData?.bikeDetails?.titleStatus || '-'} id='name' label="What is the title's Status?" />
        <br></br>
        <TextFieldCustomized defaultValue={userData?.bikeDetails?.mileage || '-'} id='name' label='What is the Mileage' />
        <br></br>
        <TextFieldCustomized
          defaultValue={userData?.bikeDetails?.milesUsed || '-'}
          id='name'
          label='How many miles have beed added under current ownership?'
        />
        <br></br>
        <RadioCustom
          buttonData={defaultButtonData}
          label="Is this motorcycle for sale elsewhere?"
          iconDisplay="false"
          selected={selectedSaleElsewhere}
          onChange={(value) => {
          }}
        />
        <br></br>
        <RadioCustom
          buttonData={defaultButtonData}
          label="Are there any significant mechanical or cosmetic flaws that we should know about?"
          iconDisplay="false"
          selected={selectedHasFlaws}
          onChange={(value) => {
          }}
        />
        <Textarea defaultValue={userData?.bikeDetails?.description || '-'} id='name' label='Tell us more about the bike?' instruction='Minimum 300 characters' />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8} lg={6}>
            <Box
              sx={{
                padding: '20px',
                marginTop: '20px',
                borderRadius: '10px',
                backgroundColor: '#f6f8fb',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                left: 20
              }}
            >
              <Typography
                variant='body3'
                sx={{
                  color: 'black',
                  paddingBottom: '10px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Price?
                <Icon icon='material-symbols:info' style={{ marginLeft: 8, fontSize: '1.2rem' }} />
              </Typography>
              <RadioCustom
                width="12"
                label="Do you want to set a minimum price required for your vehicle to sell?"
                buttonData={defaultButtonData}
                selected={selectedReservePrice}
                onChange={(value) => {
                }}
              />
              <br></br>
              <TextFieldCustomized
                width="12"
                defaultValue={`$${userData?.bikeDetails?.reservePrice ?? '0'}`}
                id="name"
                label="What reserve price would you like?"
              />
            </Box>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value='3' sx={{ padding: 8, paddingTop: 0 }}>
        <br></br>
        <Typography variant='body3' sx={{ color: 'black', paddingBottom: '5px', fontWeight: '600', fontSize: '20px' }}>
          Total Photos ({userData?.pictures?.length || 0})
        </Typography>
        <br></br>
        <div style={{ marginTop: '15px' }}>
          <hr style={{ border: 'none', borderTop: '1px solid #ccc' }} />
        </div>

        <br></br>
        <ImageTab tab1={userData?.pictures ?? []}></ImageTab>
      </TabPanel>

      <TabPanel value='4' sx={{ padding: 8, paddingTop: 0 }}>
        <br></br>
        <Typography variant='body3' sx={{ color: 'black', fontSize: '20px', paddingBottom: '5px', fontWeight: '600' }}>
          Videos ({userData?.videos?.length ?? '0'})
        </Typography>
        <br></br>
        <br></br>

        <VideoGallery closeDisplay={true} videoUrls={userData?.videos ?? []}></VideoGallery>

        <br></br>
        <Typography variant='body3' sx={{ color: 'black', fontSize: '18px', paddingBottom: '5px', fontWeight: 'bold' }}>
          Links
        </Typography>
        <br></br>
        <br></br>

        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={8}
            lg={6}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}
          >
            <Box
              sx={{
                width: '100%',
                color: '#1b7e6c',
                backgroundColor: `${lighten('#1b7e6c', 0.8)}`,
                borderRadius: '10px',
                padding: '15px',
                flex: 1,
                border: '1px #1b7e6c solid',
                marginBottom: { xs: '10px', sm: 0 },
                overflow: 'hidden',
                wordWrap: 'break-word',
                whiteSpace: 'normal'
              }}
            >
              <Typography variant='body2' sx={{ color: '#1b7e6c', fontWeight: 'bold', wordWrap: 'break-word' }}>
                https://www.youtube.com/watch?v=MZ8
              </Typography>
            </Box>

            <Button
              onClick={handleDelete}
              sx={{
                marginTop: { xs: '10px', sm: 0 },
                marginLeft: { sm: '40px', xs: 0 },
                textTransform: 'none',
                alignSelf: { xs: 'center', sm: 'flex-start' },
                width: { xs: '100%', sm: 'auto' },
                padding: '10px 10px'
              }}
            >
              <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>Delete</Typography>
            </Button>
          </Grid>
        </Grid>
        <br></br>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={8}
            lg={6}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}
          >
            <Box
              sx={{
                width: '100%',
                color: '#1b7e6c',
                backgroundColor: `${lighten('#1b7e6c', 0.8)}`,
                borderRadius: '10px',
                padding: '15px',
                flex: 1,
                border: '1px #1b7e6c solid',
                marginBottom: { xs: '10px', sm: 0 },
                overflow: 'hidden',
                wordWrap: 'break-word',
                whiteSpace: 'normal'
              }}
            >
              <Typography variant='body2' sx={{ color: '#1b7e6c', fontWeight: 'bold', wordWrap: 'break-word' }}>
                https://www.youtube.com/watch?v=MZ8
              </Typography>
            </Box>

            <Button
              onClick={handleDelete}
              sx={{
                marginTop: { xs: '10px', sm: 0 },
                marginLeft: { sm: '40px', xs: 0 },
                textTransform: 'none',
                alignSelf: { xs: 'center', sm: 'flex-start' },
                width: { xs: '100%', sm: 'auto' },
                padding: '10px 10px'
              }}
            >
              <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>Delete</Typography>
            </Button>
          </Grid>
        </Grid>
      </TabPanel>
      {showApprovalTab && (
        <TabPanel value='5' sx={{ padding: 8 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Box>
              <TextFieldCustomized
                defaultValue={bidPrice}
                id="bid-price"
                label="Bid Price*"
                type="number"
                placeholder="Enter Bid Price"
                required
                onChange={e => setBidPrice(e.target.value)}
                error={Boolean(errors.bidPrice)}
                helperText={errors.bidPrice || ""}
                isReadOnly={true}
                disabled={loading}
              />
            </Box>
            <Box>
              <Label />
              <InputLabel shrink htmlFor='bootstrap-input' sx={{ transform: 'translate(0, -4px) scale(0.75)', fontSize: '1.1rem' }}>
                Auction End Date*
              </InputLabel>

              <Grid container spacing={2} style={{}}>
                <Grid item xs={12} sm={6} lg={4}>
                  <DatePickerWrapper>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileDateTimePicker
                        defaultValue={dayjs(bidEndDate)}
                        onChange={handleDateChange}
                        shouldDisableDate={disablePastDates}
                        disabled={loading}
                        sx={{
                          width: '100%',
                          '& .MuiInputBase-root': {
                            height: '45px',
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </DatePickerWrapper>

                </Grid>
              </Grid>
              {errors.bidEndDate && <Typography color="error" fontSize="0.8rem" mt={1}>{errors.bidEndDate}</Typography>}
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
              <RadioCustom
                selected="No"
                buttonData={defaultButtonData}
                label='Is Featured?'
                iconDisplay='false'
                onChange={handleFeaturedChange}
                disabled={loading}
              />
            </Box>           
          </Box>
        </TabPanel>
      )}

      <TabPanel value="successTab" sx={{ padding: 8, paddingTop: 4 }}>
        <Box textAlign='center' sx={{ marginBottom: '20px' }}>
          <Box display='flex' justifyContent='center' marginBottom={4}>
            <Icon icon='teenyicons:tick-circle-solid' width='70' height='70' color='#5EAC24'
              sx={{
                pointerEvents: 'none',
                userSelect: 'none',
                cursor: 'default',
                '&:hover': { backgroundColor: 'transparent' }
              }} />
          </Box>

          <Typography variant='h6' fontWeight='500' color='black'>
            {userData?.userDetails?.fullName || '-'}
          </Typography>
          <Box
            display='inline-block'
            sx={{
              backgroundColor: '#5EAC2414',
              border: '1px solid #5EAC24',
              borderRadius: '10px',
              margin: '20px',
              padding: '10px 25px'
            }}
            paddingX={1}
            paddingY={1}
          >
            <Typography variant='body2' color='#5EAC24'>
              Bid: {bidPrice}
            </Typography>
          </Box>
          <Typography variant='h5' fontWeight='600' marginTop={0} color={'black'} marginBottom={4}>
            Application Reviewed Successfully
          </Typography>
          <Typography variant='body2' color='text.secondary' fontWeight='500'>
            this can go live for Bid auctions
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value="failureTab" sx={{ padding: 8, paddingTop: 4 }}>
        <Box textAlign='center' sx={{ marginBottom: '15px' }}>
          <Icon icon='ix:namur-failure-filled' width='78' height='78' color='red '
            sx={{
              pointerEvents: 'none',
              userSelect: 'none',
              cursor: 'default',
              '&:hover': { backgroundColor: 'transparent' }
            }} />
          <Typography variant='h6' fontWeight='500' color='black'>
            {userData?.userDetails?.fullName || '-'}
          </Typography>
          <Typography variant='h5' fontWeight='600' marginTop={2} color={'black'} marginBottom={4}>
            {errorMessage}
          </Typography>
          <Typography variant='body2' color='text.secondary' fontWeight='600'>
            this can go live for Bid auctions
          </Typography>
        </Box>
      </TabPanel>

      <Grid
        container
        justifyContent="flex-end"
        sx={{ flexDirection: { xs: "column", sm: "row" }, padding: 3, borderTop: "1px solid #e0e0e0" }}
      >
        {["successTab", "failureTab"].includes(value) ? (
          <Button
            variant="contained"
            color={value === "failureTab" ? "error" : "primary"}
            onClick={handleClose}
            sx={{ textTransform: "none" }}
          >
            Go to Dashboard
          </Button>
        ) : value === "5" ? (
          <>
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              color="primary"
              onClick={handleBack}
              disabled={loading}
              sx={{
                borderColor: "black",
                color: "black",
                marginRight: { xs: 0, sm: 2 },
                marginTop: { xs: 2, sm: 0 },
                textTransform: "none",
              }}
            >
              Previous
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleClick}
              sx={{ marginTop: { xs: 2, sm: 0 }, textTransform: "none" }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Submit"}
            </Button>
          </>
        ) : (
          <>
            {value !== "1" && (
              <Button
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                color="primary"
                onClick={handleBack}
                sx={{
                  borderColor: "black",
                  color: "black",
                  marginRight: { xs: 0, sm: 2 },
                  marginTop: { xs: 2, sm: 0 },
                  textTransform: "none",
                }}
              >
                Previous
              </Button>
            )}
            {value !== String(totalPages) && value !== "5" && (
              <Button
                endIcon={<ArrowForwardIcon />}
                variant="contained"
                color="primary"
                onClick={handleNext}
                sx={{ marginTop: { xs: 2, sm: 0 }, textTransform: "none" }}
              >
                Next
              </Button>
            )}
            {value === String(totalPages) && value !== "5" && (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReject}
                  sx={{ marginRight: { xs: 0, sm: 2 }, marginTop: { xs: 2, sm: 0 }, textTransform: "none" }}
                  disabled={userData.status === "rejected"}
                >
                  {rejectLoading ? <CircularProgress size={24} sx={{ color: "black" }} /> : "Reject"}
                </Button>

                <Button
                  endIcon={<ArrowForwardIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleOpenApprovalTab}
                  sx={{ marginTop: { xs: 2, sm: 0 }, textTransform: "none" }}
                  disabled={userData?.status !== "draft"}
                >
                  Approve / Ready for Auction 
                </Button>
              </>
            )}
          </>
        )}
         {/* Success Dialog */}
      <AlertDialog 
        open={successOpen || rejectSuccess}
        successMessage={rejectSuccess ? 'Rejected Successfully' : 'Operation Successful'}
        errorMessage=""
        handleClose={handleClose}
        navigateToDashboard={rejectSuccess} 
      />

      {/* Failure Dialog */}
      <AlertDialog 
        open={failureOpen || rejectFailure}
        successMessage=""
        errorMessage={errorMessage || 'Something Went Wrong'}
        handleClose={handleClose}
        navigateToDashboard={rejectFailure} 
      />
      </Grid>
    </TabContext>
  )
}

export default ApplicationUserDetails
