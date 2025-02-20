import { useEffect, useRef, useState } from 'react'
import Card from '@mui/material/Card'
import {
  Button,
  CardHeader,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  useMediaQuery,
  IconButton,
  Alert
} from '@mui/material'
import { useRouter } from 'next/router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CustomChip from 'src/@core/components/mui/chip'
import 'react-quill/dist/quill.snow.css'
import { Icon } from '@iconify/react'
import FilledBadge from 'src/views/components/badges/BadgesFilled'
import VideoGallery from 'src/views/components/images/videoGallery'
import ImageCollapse from 'src/views/components/images/imageCollapse'
import axiosInstanceNew from 'src/axiosInstanceNew'
import Spinner from 'src/@core/components/spinner'
import { useTheme } from '@emotion/react'
import ImageGallery from 'src/views/components/images/imageGallery'
import ComposePopup from 'src/views/apps/email/ComposePopup'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import { FormControl } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AlertDialog from '../../@core/utils/alertDialog'
import RenderClient from 'src/pages/components/renderclient'
import { formatDate,formatDay ,getRemainingTime1} from 'src/@core/utils/getRemainingTime'

const StyledTabList = styled(TabList)(() => ({
  '& .tabStyle': {
    textTransform: 'none',
    fontSize: '16px',
    marginBottom: 3
  },
  '& .MuiTab-root': {
    textTransform: 'none'
  }
}))


const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const fetchData = async ids => {
  if(!isValidObjectId(ids)){
    console.error("Inavlid User id")
  }
else{
  try {
    const data = await axiosInstanceNew.get(`/get-auctions?auctionId=${ids}&sortBy=newlyAdded`)
    const foundUser = data.data.find(user => {
      return String(user._id).trim() === String(ids).trim()
    })
    return foundUser
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message)
    console.error('Response status:', error.response ? error.response.status : null)
    console.error('Response headers:', error.response ? error.response.headers : null)
    console.error('error', error.message)

    return {}
  }
}
}

const getAuctionData = async auctionId => {
  if(!isValidObjectId(auctionId)){
    console.error("Inavlid User id")
  }
  else{
    try {
      var bidsData = await axiosInstanceNew.get(`/get-biddings?auctionId=${auctionId.toString()}`)
      var CommentsData = await axiosInstanceNew.get(`/get-comments?auctionId=${auctionId.toString()}`)
      if (bidsData.status == 'error') {
        bidsData = []
      }
      if (CommentsData.status == 'error') {
        CommentsData = []
      }
      return { bidsData: bidsData.data.allBids, CommentsData: CommentsData.data }
    } catch (error) {
      console.error('Error fetching data:', error)
      return { bidsData: [], CommentsData: [] }
    }
  }
}

const statusObj = {
  1: { title: 'Pending', color: 'info' },
  2: { title: 'New', color: 'error' },
  3: { title: 'Completed', color: 'success' },
  4: { title: 'Pending', color: 'info' },
  5: { title: 'applied', color: 'info' },
  6: { title: 'Seller', color: 'primary' },
  7: { title: 'Bidder', color: 'secondary' },
  8: { title: 'Dealer', color: 'success' },
  9: { title: 'Private Party', color: 'info' }
}
const userTypeMapping = {
  Seller: 6,
  Bidder: 7,
  Dealer: 8,
  'Private Party': 9
}

const userDetails = ({ userId }) => {
  const router = useRouter()
  const theme = useTheme()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState('1')
  const [commentsDetails, setCommentsDetails] = useState([])
  const [bidsDetails, setBidsDetails] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [smallLoading, setSmallLoading] = useState(false)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [fetchTrigger, setFetchTrigger] = useState(0)
  const [selectedValue, setSelectedValue] = useState({ bid: null, id: null })
  const [bidOpen, setBidOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const dialogRef = useRef(null)
  const [openDialog, setOpenDialog] = useState(false)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const handleNavigation = () => {
    if (userData?.userInfo?.useremail) {
      router.push(`/users/userview/${userData.userInfo.useremail}`)
    }
  }



  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const [composeOpen, setComposeOpen] = useState(false)

  const toggleComposeOpen = () => setComposeOpen(!composeOpen)
  const composePopupWidth = mdAbove ? 754 : smAbove ? 520 : '100%'

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = (event, reason) => {
    if (reason === 'backdropClick') {
      return
    }
    setOpenDialog(false)
  }

  useEffect(() => {

    setLoading(true)
    const fetchDataAndSetState = async () => {
      if (!userId){

      return
      }
      setLoading(true)
      try {
        const data = await fetchData(userId)
        const auctionData = await getAuctionData(userId)

        if (data && Object.keys(data).length !== 0) {
          setUserData(data)
          setLoading(false)
        } else {
          setDialogOpen(true)
          setErrorMessage('Data not Found')
          setSuccessMessage('')

        }
        setCommentsDetails(auctionData?.CommentsData ?? {})
        setBidsDetails(auctionData?.bidsData ?? {})
      } catch (error) {
        console.error('error', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDataAndSetState()
  }, [userId, fetchTrigger])

  const handleBack = () => {
    router.push('/auctions/')
  }


  const handleClick = async (bidPrice, reservePrice, userId) => {
    if (bidPrice > reservePrice) {
      const data = {
        auctionId: userId,
        status: 'sold',
        mode: 'editStatus',
        bearerToken: 'bearerToken'
      }
      setSmallLoading(true)
      try {
        const response = await axiosInstanceNew.post('/auction', data,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        if (response.status == 'error') {
          setDialogOpen(true)

          setErrorMessage(response.message)
        } else {
          setDialogOpen(true)
          setSuccessMessage('Status Updated Successfully')
          setErrorMessage('')
        }
      } catch (error) {
        console.error(error)
        setDialogOpen(true)
        setErrorMessage(error.message)
      } finally {
        setSmallLoading(false)
      }
    } else {
      setBidOpen(true)
    }
  }
  const handleCancel = () => {
    setSelectedValue({ bid: null, id: null })
    setBidOpen(false)
  }
  const handleSubmit = async (bidId, userId) => {
    const data = {
      auctionId: userId,
      status: 'sold',
      mode: 'editStatus',
      biddingId: bidId,
      bearerToken: 'bearerToken'
    }
    setDialogLoading(true)
    try {
      const response = await axiosInstanceNew.post('/auction', data,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      if (response.status == 'error') {
        setDialogOpen(true)
        setBidOpen(false)
        setErrorMessage(response.message)
        setSuccessMessage('')
      } else {
        setDialogOpen(true)
        setBidOpen(false)
        setSuccessMessage('Status Updated Successfully')
      }
    } catch (error) {
      console.error(error)
      setDialogOpen(true)
      setBidOpen(false)
      setErrorMessage(error.message)
      setSuccessMessage('')
    } finally {
      setDialogLoading(false)
    }
  }
  const handleDelete = async auctionId => {
    setDeleteLoading(true)
    try {
      const data = await axiosInstanceNew.delete(`auction`, {
        data: { auctionId: auctionId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      if (data.status == 'error') {
        setDialogOpen(true)
        setErrorMessage(data.message)
        setSuccessMessage('')
      } else {
        setDialogOpen(true)
        setSuccessMessage('Deleted Successfully')
        setErrorMessage('')
      }
    } catch (err) {
      console.error(err)
      setDialogOpen(true)
      setErrorMessage('Something Went Wrong')
      setSuccessMessage('')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      return
    }

    if (successMessage === 'Deleted Successfully' || errorMessage === 'Data not Found' || errorMessage === 'UserId not Found') {
      router.push(`/auctions`)
    }

    if (successMessage === 'Status Updated Successfully') {
      setFetchTrigger(prev => prev + 1)
    }
    setDialogOpen(false)
    setValue('1')
    setSelectedValue({ bid: null, id: null })
    setBidOpen(false)
  }

  const buttonText = userData?.status === 'sold' ? 'Sold' : 'Mark As Sold'



  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <ComposePopup
            toMailId={userData?.email}
            mdAbove={mdAbove}
            composeOpen={composeOpen}
            composePopupWidth={composePopupWidth}
            toggleComposeOpen={toggleComposeOpen}
          />

          <Box
            sx={{
              marginBottom: { xs: '20px', md: '0px', lg: '0px' },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Box>
              <Typography variant='h6' sx={{ textTransform: 'none', marginLeft: '7px !important' }}>
                Auction Details
              </Typography>
              <Button
                startIcon={<ArrowBackIcon sx={{ color: 'primary.main' }} />}
                onClick={handleBack}
                sx={{ border: 'none', color: 'black', marginBottom: '15px', marginLeft: '-5px !important' }}
              >
                <Typography variant='body2' sx={{ color: 'primary.main', textTransform: 'none' }}>
                  Back to Auctions /
                </Typography>
              </Button>
            </Box>
            <Box
              gap={2}
              spacing={2}
              sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row', lg: 'row' }, alignItems: 'center' }}
            >
              <Button
                variant='outlined'
                sx={{
                  size: 'small',
                  fontSize: { xs: '13px', sm: '15px', textTransform: 'none' },
                  mt: { xs: 2, sm: 0 }
                }}
                onClick={() => setComposeOpen(true)}
              >
                Send a Message
              </Button>
              <Button
                variant='outlined'
                color='error'
                onClick={() => handleDelete(userId)}
                sx={{
                  size: 'small',
                  fontSize: { xs: '13px', sm: '15px', textTransform: 'none' },
                  mt: { xs: 2, sm: 0 }
                }}
              >
                {deleteLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress sx={{ color: 'red', mr: 1 }} size={16} />
                    <Typography variant='body2'>Deleting...</Typography>
                  </Box>
                ) : (
                  'Delete Auction'
                )}
              </Button>
              <Button
                variant='outlined'
                color='warning'
                onClick={() => handleClick(userData?.bidPrice, userData?.reservePrice, userId)}
                disabled={(userData?.status ?? '-') === 'sold'}
                sx={{
                  size: 'small',
                  fontSize: { xs: '13px', sm: '15px', textTransform: 'none' },
                  mt: { xs: 2, sm: 0 }
                }}
              >
                {smallLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress sx={{ color: 'red', mr: 1 }} size={16} />
                    <Typography variant='body2'>Loading</Typography>
                  </Box>
                ) : (
                  buttonText
                )}
              </Button>
            </Box>
          </Box>

          <Card>
            <CardHeader
              title={
                <Grid
                  container
                  spacing={3}
                  sx={{
                    alignItems: 'center',
                    justifyContent: { xs: 'center', md: 'space-between' },
                    flexDirection: 'row'
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: { xs: 'center', md: 'flex-start' }
                    }}
                  >

                   <RenderClient row={{ avatar: userData?.motorcycleDetails?.pictures?.[0].url, full_name: userData?.userFullName || '' }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                      <Typography variant='h6' sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {userData?.userInfo?.username ?? '-'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={1.5}
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: 'center',
                      justifyContent: { xs: 'center', md: 'flex-start' },
                      gap: { xs: 3, md: 10 }
                    }}
                  >
                    <CustomChip
                      skin='light'
                      size='small'
                      color={statusObj[userTypeMapping[userData?.userSellerType]]?.color || 'info'}
                      label={
                        statusObj[userTypeMapping[userData?.userSellerType]]?.title || userData?.userSellerType || '-'
                      }
                      sx={{
                        height: 20,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        borderRadius: '5px',
                        textTransform: 'capitalize',
                        maxWidth: 'unset',
                        whiteSpace: 'nowrap'
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: 'center',
                      justifyContent: { xs: 'center', md: 'space-around' }
                    }}
                    gap={2}
                  >
                    <Box
                      gap={2}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        ml: 2,
                        alignItems: { xs: 'center', md: 'flex-start' }
                      }}
                    >
                      <Typography sx={{ whiteSpace: 'nowrap', overflow: 'auto' }}>Bid Started On:</Typography>

                      <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                        {userData?.motorcycleDetails?.createdAt
                          ? formatDate(userData.motorcycleDetails.createdAt)
                          : '-'}
                      </Typography>
                    </Box>
                    <Box
                      gap={2}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        ml: 2,
                        alignItems: { xs: 'center', md: 'flex-start' }
                      }}
                    >
                      <Typography sx={{ whiteSpace: 'nowrap', overflow: 'auto' }}>Last Seen update on:</Typography>
                      <Box
                        gap={2}
                        sx={{ display: 'flex', flexDirection: 'row', alignItems: { xs: 'center', md: 'flex-start' } }}
                      >
                        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                          {userData?.motorcycleDetails?.updatedAt
                            ? formatDate(userData.motorcycleDetails.updatedAt)
                            : '-'}
                        </Typography>
                        <Icon icon='solar:refresh-linear' width='20' height='20' color={theme.palette.primary.main} />
                      </Box>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={3.5}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: { xs: 'center', md: 'flex-end' },
                      gap: 2
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: { xs: 'center', md: 'flex-end' },
                        gap: 2
                      }}
                    >
                      <Button
                        color='secondary'
                        variant='contained'
                        size='medium'
                        startIcon={<Icon icon='material-symbols-light:pace' width='20' height='20' />}
                        sx={{
                          textTransform: 'none',
                          textAlign: 'center',
                          paddingLeft: { xs: '12px !important' },
                          paddingRight: { xs: '12px !important' }
                        }}
                      >
                        {userData?.bidEndingOn ? getRemainingTime1(userData.bidEndingOn) : '-'}
                      </Button>
                      <Button
                        color='primary'
                        variant='contained'
                        size='medium'
                        sx={{
                          textTransform: 'none',
                          textAlign: 'center',
                          paddingLeft: { xs: '12px !important' },
                          paddingRight: { xs: '12px !important' }
                        }}
                      >
                        Bid: ${userData?.bidPrice ?? '0'}
                      </Button>
                    </Box>
                    {userData?.reservePrice !== null || 0 ? (
                      <Typography
                        variant='body1'
                        sx={{ textAlign: 'center', marginTop: 2, marginRight: { xs: '10px', md: '8px' } }}
                      >
                        <Button
                          color='primary'
                          variant='contained'
                          size='medium'
                          sx={{
                            textTransform: 'none',
                            textAlign: 'center',
                            paddingLeft: { xs: '12px !important' },
                            paddingRight: { xs: '12px !important' }
                          }}
                        >
                          Reserved Price: ${userData?.reservePrice ?? '0'}
                        </Button>
                      </Typography>
                    ) : (
                      ''
                    )}
                  </Grid>
                </Grid>
              }
            />

            <hr style={{ border: 'none', borderTop: '1px solid #ccc' }} />
            <Box
              sx={{
                padding: 5
              }}
            >
              <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                Details
              </Typography>

              <Box
                sx={{
                  padding: '30px',
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
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', marginBottom: 2 }}>
                      Bike
                    </Typography>

                    <Typography variant='body3' sx={{ color: 'black' }}>
                      {userData?.motorcycleDetails?.bikeDetails
                        ? `${userData?.motorcycleDetails?.bikeDetails?.year || '-'} ${
                            userData?.motorcycleDetails?.bikeDetails?.model || '-'
                          }`
                        : '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={3}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', marginBottom: 2 }}>
                      Engine
                    </Typography>
                    <Typography variant='body3' sx={{ color: 'black' }}>
                      {userData?.motorcycleDetails?.bikeDetails?.engineConfiguration
                        ? userData?.motorcycleDetails?.bikeDetails?.engineConfiguration
                        : '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={3}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', marginBottom: 2 }}>
                      Mileage
                    </Typography>
                    <Typography variant='body3' sx={{ color: 'black' }}>
                      {userData?.motorcycleDetails?.bikeDetails?.mileage ?? '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={3}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', marginBottom: 2 }}>
                      Modal
                    </Typography>
                    <Typography variant='body3' sx={{ color: 'black' }}>
                      {userData?.motorcycleDetails?.bikeDetails?.model ?? '-'}
                    </Typography>
                  </Grid>
                </Grid>
                <br></br>
                <br></br>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', marginBottom: 2 }}>
                      Seller
                    </Typography>
                    <Typography variant='body3' sx={{ color: 'primary.main' }} onClick={handleNavigation}>
                      {userData?.userInfo?.username ?? '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={3}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', marginBottom: 2 }}>
                      Location
                    </Typography>
                    <Typography variant='body3' sx={{ color: 'black' }}>
                      {userData?.motorcycleDetails?.bikeDetails?.city?.name
                        ? userData?.motorcycleDetails?.bikeDetails?.city?.name
                        : userData?.motorcycleDetails?.bikeDetails?.state?.name
                        ? userData?.motorcycleDetails?.bikeDetails?.state?.name
                        : '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={3}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', marginBottom: 2 }}>
                      Seller Type
                    </Typography>
                    <Typography variant='body3' sx={{ color: 'black', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {userData?.userSellerType ?? '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={3}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', marginBottom: 2 }}>
                      Colour
                    </Typography>
                    <Typography variant='body3' sx={{ color: 'black' }}>
                      {userData?.motorcycleDetails?.bikeDetails?.color ?? '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <br></br>

              <Typography>
                This 2021 Harley-Davidson Electra Glide Revival is one of 1,500 serialized examples produced in homage
                to the 1969 Electra Glide, the first Harley-Davidson model offered with an accessory Batwing fairing. It
                is finished in Hi-Fi Blue and Denim Black with Birch White saddlebags and fairing, and it is powered by
                a 114ci Milwaukee Eight V-twin paired.
              </Typography>

              <br></br>
              <hr style={{ border: 'none', borderTop: '1px solid #ccc' }} />
              <br></br>
              <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                Highlights
              </Typography>
              <br></br>
              <Typography>Chrome wire-spoke 16″ wheels are wrapped in Dunlop wide-whitewall tires. </Typography>
              <br></br>
              <Typography>The 114ci Milwaukee Eight V-twin was factory rated at 118 lb-ft of torque</Typography>
              <br></br>
              <Typography>Power is sent to the rear wheel through a six-speed Cruise Drive</Typography>
              <Typography>transmission and a drive belt.</Typography>
              <br></br>
              <Typography>A 120-mph speedometer, a tachometer with a 5,500-rpm redline</Typography>
              <br></br>
              <Typography>Box 6.5GT touchscreen infotainment system, </Typography>

              <br></br>
              <hr style={{ border: 'none', borderTop: '1px solid #ccc' }} />
              <br></br>
              <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                Bid Info
              </Typography>
              <br></br>
              <Box
                sx={{
                  padding: '30px',
                  borderTopLeftRadius: '20px',
                  borderTopRightRadius: '20px',
                  backgroundColor: '#f6f8fb',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  left: 20,
                  width: { lg: '70%', sm: '100%', md: '100%', xs: '100%' }
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                      Bid Price
                    </Typography>
                    <Typography variant='body3' sx={{ color: 'black', fontWeight: 'bold', fontSize: '24px' }}>
                      Bid: {userData?.bidPrice ?? '0'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={3}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', marginBottom: 2 }}>
                      Seller
                    </Typography>
                    <Typography
                      variant='body3'
                      sx={{ color: 'primary.main', whiteSpace: 'normal', wordBreak: 'break-word' }}
                      onClick={handleNavigation}
                    >
                      {userData?.userInfo?.username ?? '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={3}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', marginBottom: 2 }}>
                      Bid Ending
                    </Typography>
                    <Typography variant='body3' sx={{ color: 'black' }}>
                      {userData?.bidEndingOn ? getRemainingTime1(userData.bidEndingOn) : '-'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={4} lg={2}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', marginBottom: 2 }}>
                      Views
                    </Typography>
                    <Typography variant='body3' sx={{ color: 'black' }}>
                      {userData?.views ?? 0}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={2} lg={1}>
                    <Typography variant='body2' sx={{ color: 'text.secondary', marginBottom: 2 }}>
                      Bids
                    </Typography>
                    <Typography variant='body3' sx={{ color: 'black' }}>
                      {bidsDetails?.length ?? 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box
                sx={{
                  padding: '30px',
                  borderBottomLeftRadius: '20px',
                  borderBottomRightRadius: '20px',
                  backgroundColor: '#DEE6EE',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  left: 20,
                  width: { lg: '70%', sm: '100%', md: '100%', xs: '100%' }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    width: '40%',
                    gap: {
                      xs: 3,
                      md: 10
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 2
                    }}
                  >
                    <Icon icon='ph:chat-text' width='24' height='24' />
                    <Typography>Comments</Typography>
                    <FilledBadge colour='black' text={commentsDetails.length}></FilledBadge>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 2
                    }}
                  >
                    <Icon icon='material-symbols-light:kid-star' width='24' height='24' color='#F68500' />
                    <Typography>Watchlist</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 2
                    }}
                  >
                    <Icon icon='ic:baseline-ios-share' width='24' height='24' />
                    <Typography>Share</Typography>
                  </Box>
                </Box>
              </Box>
              {(userData?.motorcycleDetails?.pictures?.length ?? 0) !== 0 && (
                <>
                  <br></br>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 2
                    }}
                  >
                    <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                      Photos ({userData?.motorcycleDetails?.pictures?.length ?? 0})
                    </Typography>
                    <Button
                      sx={{
                        borderRadius: '8px',
                        padding: '5px 16px',
                        color: 'primary',
                        backgroundColor: 'transparent',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: 'transparent'
                        }
                      }}
                      onClick={handleOpenDialog}
                    >
                      View All
                    </Button>
                  </Box>

                  <br></br>
                  <ImageCollapse
                    imageCount={userData?.motorcycleDetails?.pictures?.length ?? 0}
                    images={userData?.motorcycleDetails?.pictures ?? []}
                  ></ImageCollapse>

                  <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='md' fullWidth>
                    <DialogContent sx={{ overflowY: 'auto', maxHeight: '70vh' }}>
                      <ImageGallery images={userData?.motorcycleDetails?.pictures ?? []} minusWidth={true} />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog} color='primary'>
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              )}
              {(userData?.motorcycleDetails?.videos?.length ?? 0) !== 0 && (
                <>
                  <br></br>
                  <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                    Videos
                  </Typography>
                  <br></br>
                  <VideoGallery
                    closeDisplay={true}
                    videoUrls={userData?.motorcycleDetails?.videos ?? []}
                  ></VideoGallery>
                </>
              )}
              <br></br>
              <br></br>
              <hr style={{ border: 'none', borderTop: '1px solid #ccc' }} />
              <br></br>
              <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 5 }}>
                Comments
              </Typography>
              <TabContext value={value}>
                <StyledTabList
                  variant='scrollable'
                  onChange={handleChange}
                  aria-label='customized tabs example'
                  sx={{
                    marginLeft: '0px !important',
                    '& .MuiTabs-indicator': { display: 'none' },
                    '& .MuiTab-root:not(:last-of-type)': {
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '1px',
                        height: '12px',
                        backgroundColor: '#B9BEC4'
                      }
                    }
                  }}
                >
                  <Tab
                    label={`Comments (${commentsDetails?.length ?? 0})`}
                    value='1'
                    sx={{ fontSize: '18px', paddingLeft: '0px' }}
                  />
                  <Tab label={`Bids (${bidsDetails.length})`} value='2' sx={{ fontSize: '18px' }} />
                </StyledTabList>

                <hr style={{ border: 'none', borderTop: '1px solid #ccc' }} />
                <TabPanel value='1' sx={{ paddingLeft: 0 }}>
                  {' '}
                  {commentsDetails && commentsDetails.length > 0 ? (
                    commentsDetails.map((comment, index) => (
                      <div key={index}>
                        <Grid container spacing={1} alignItems='flex-start' sx={{ marginBottom: 2 }}>
                          <Grid item xs='auto' sm='auto' sx={{ paddingRight: 3 }}>
                            <Avatar
                              src={comment?.userDetails?.profileImage || undefined}
                              sx={{ width: 40, height: 40 }}
                            >
                              {!comment?.userDetails?.profileImage &&
                                (comment?.userDetails?.username?.slice(0, 2).toUpperCase() || 'A')}
                            </Avatar>
                          </Grid>
                          <Grid item xs={12} sm={11}>
                            <Grid
                              container
                              spacing={1}
                              alignItems='center'
                              sx={{ marginBottom: 1, flexWrap: 'nowrap' }}
                            >
                              <Grid item xs='auto'>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '15px', color: '#152639', mr: 2 }}>
                                  {comment?.userDetails?.username ?? '-'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs='auto'
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  borderLeft: '1px solid #B9BEC4',
                                  height: '12px',
                                  paddingLeft: 1,
                                  marginLeft: 2,
                                  marginRight: 4,
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                <Typography
                                  sx={{ color: '#5B6774', fontWeight: '400', marginLeft: '10px', fontSize: '13px' }}
                                >
                                  {comment?.createdAt ? formatDay(comment.createdAt) : '-'}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Typography sx={{ fontSize: '15px', color: '#152639', marginBottom: 1 }}>
                              {comment?.content ?? ''}
                            </Typography>
                            <Grid
                              container
                              spacing={2}
                              alignItems='center'
                              sx={{ marginTop: 1, flexDirection: 'row', justifyContent: 'flex-start' }}
                            >
                              <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                                <Icon
                                  icon='material-symbols:thumb-up-outline'
                                  width='24'
                                  height='24'
                                  style={{ marginRight: '8px' }}
                                />
                                <Typography
                                  sx={{
                                    display: 'inline-block',
                                    border: '1px solid #B9BEC4',
                                    padding: '2px 8px',
                                    borderRadius: '8px',
                                    mr: 2
                                  }}
                                >
                                  {comment?.likes ?? '0'}
                                </Typography>
                              </Grid>
                              <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                                <Icon icon='gridicons:reply' width='24' height='24' style={{ marginRight: '8px' }} />
                                <Typography>Reply</Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <br />
                      </div>
                    ))
                  ) : (
                    <p>No comments available</p>
                  )}
                </TabPanel>
                <TabPanel value='2' sx={{ paddingLeft: 0 }}>
                  {bidsDetails && bidsDetails.length > 0 ? (
                    bidsDetails.map((comment, index) => (
                      <div key={index}>
                        <Grid container spacing={1} alignItems='flex-start' sx={{ marginBottom: 2 }}>
                          <Grid item xs='auto' sm='auto' sx={{ paddingRight: 3 }}>
                            <Avatar
                              src={comment?.userDetails?.profileImage || undefined}
                              sx={{ width: 40, height: 40 }}
                            >
                              {!comment?.userDetails?.profileImage &&
                                (comment?.userDetails?.username?.slice(0, 2).toUpperCase() || 'A')}
                            </Avatar>
                          </Grid>
                          <Grid item xs={12} sm={11}>
                            <Grid
                              container
                              spacing={1}
                              alignItems='center'
                              sx={{ marginBottom: 1, flexWrap: 'nowrap' }}
                            >
                              <Grid item xs='auto'>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '15px', color: '#152639', mr: 2 }}>
                                  {comment?.userDetails?.username ?? '-'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs='auto'
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  borderLeft: '1px solid #B9BEC4',
                                  height: '12px',
                                  paddingLeft: 1,
                                  marginLeft: 2,
                                  marginRight: 4,
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                <Typography
                                  sx={{ color: '#5B6774', fontWeight: '400', marginLeft: '10px', fontSize: '13px' }}
                                >
                                  {comment?.createdAt ? formatDay(comment.createdAt) : '-'}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Button
                              sx={{
                                backgroundColor: 'black',
                                mt: 2,
                                '&:hover': {
                                  backgroundColor: 'black !important'
                                }
                              }}
                            >
                              <Typography sx={{ fontSize: '12px', color: '#fff' }}>
                                Bid: ${comment?.bidPrice ?? '0'}
                              </Typography>
                            </Button>
                          </Grid>
                        </Grid>
                        <br />
                      </div>
                    ))
                  ) : (
                    <p>No bids available</p>
                  )}
                </TabPanel>
              </TabContext>
              <AlertDialog open={dialogOpen} errorMessage={errorMessage} handleClose={handleClose}  successMessage={successMessage}/>
              <Dialog
                open={bidOpen}
                onClose={handleCancel}
                maxWidth='xs'
                fullWidth
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '& .MuiPaper-root': {
                    borderRadius: '20px',
                    maxWidth: '550px',
                    maxHeight: '450px',
                    overflow: 'visible'
                  }
                }}
              >
                <IconButton onClick={handleCancel} sx={{ position: 'absolute', top: 7, right: 10, color: 'black' }}>
                  <CloseIcon />
                </IconButton>
                <DialogContent sx={{ pb: 0 }}>
                  <Typography variant='body2' sx={{ pb: '20px', fontSize: '12px', color: 'red' }}>
                    <Alert
                      severity='error'
                      sx={{
                        width: '100%',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        mt: '25px',
                        borderRadius: '7px !important'
                      }}
                    >
                      This auction doesn't cross the minimum price. Please select a bid.
                    </Alert>
                  </Typography>
                  {bidsDetails?.length > 0 ? (
                    <FormControl fullWidth sx={{ mb: 4, alignItems: 'center' }}>
                      <InputLabel
                        id='bid-select-label'
                        shrink={selectedValue.id !== ''}
                        sx={{
                          textAlign: 'center',
                          left: { xs: '50px', sm: '73px' },
                          transform: 'translateX(-50%)',
                          width: '100%',
                          display: 'flex',
                          fontSize: 'small',
                          position: 'absolute',
                          top: selectedValue.id || isFocused ? '-15%' : '30%',
                          transition: 'top 0.2s ease-in-out',
                          justifyContent: 'center',
                          pointerEvents: 'none'
                        }}
                      >
                        Select a Bid
                      </InputLabel>
                      <Select
                        labelId='bid-select-label'
                        id='bid-select'
                        value={selectedValue.id || ''}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={e => {
                          const selectedBid = bidsDetails.find(bid => bid._id === e.target.value)
                          setSelectedValue({
                            bid: String(selectedBid?.bidPrice ?? '0'),
                            id: String(selectedBid?._id ?? '0')
                          })
                        }}
                        label='Select a Bid'
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: '10px',
                          width: {
                            xs: '100%',
                            sm: '450px',
                            md: '450px',
                            lg: '450px'
                          }
                        }}
                        MenuProps={{
                          disablePortal: true,
                          container: dialogRef.current,
                          PaperProps: {
                            sx: {
                              maxHeight: '200px',
                              width: 'auto',
                              overflow: 'auto',
                              boxShadow: 3,
                              '&::-webkit-scrollbar': { width: '6px' },
                              '&::-webkit-scrollbar-thumb': { backgroundColor: 'blue', borderRadius: '4px' }
                            }
                          }
                        }}
                      >
                        {bidsDetails.map((comment, index) => (
                          <MenuItem key={index} value={comment._id}>
                            <Grid container spacing={1} alignItems='center'>
                              <Grid item xs={3} sm={3}>
                                <Avatar
                                  src={comment?.userDetails?.profileImage || undefined}
                                  sx={{ width: 35, height: 35 }}
                                >
                                  {!comment?.userDetails?.profileImage &&
                                    comment?.userDetails?.username?.slice(0, 2).toUpperCase()}
                                </Avatar>
                              </Grid>
                              <Grid item xs={6} sm={6}>
                                <Typography
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    color: '#152639',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {comment?.userDetails?.username ?? '-'}
                                </Typography>
                              </Grid>
                              <Grid item xs={3} sm={3}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '14px', color: '#152639' }}>
                                  ${comment?.bidPrice ?? '0'}
                                </Typography>
                              </Grid>
                            </Grid>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography sx={{ textAlign: 'center' }}>No bids available</Typography>
                  )}
                  <Grid container justifyContent='center' sx={{ mt: 3, mb: 5 }}>
                    <Button
                      disabled={!selectedValue.bid || !selectedValue.id}
                      variant='contained'
                      color='primary'
                      onClick={() => handleSubmit(selectedValue.id, userId)}
                      sx={{ textTransform: 'none', p: '8px', fontSize: '16px', height: '35px', width: '150px' }}
                    >
                      {dialogLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CircularProgress sx={{ color: 'white', mr: 1 }} size={16} />
                          <Typography variant='body2' sx={{ color: 'white' }}>
                            Loading
                          </Typography>
                        </Box>
                      ) : (
                        'Submit'
                      )}
                    </Button>
                  </Grid>
                </DialogContent>
              </Dialog>
            </Box>
          </Card>
        </>
      )}
    </>
  )
}
export async function getServerSideProps(context) {
  return {
    props: { userId: context.query.userId || null }
  }
}

export default userDetails
