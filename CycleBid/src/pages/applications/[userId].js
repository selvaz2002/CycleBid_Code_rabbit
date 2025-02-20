import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import axiosInstanceNew from 'src/axiosInstanceNew'
import 'react-quill/dist/quill.snow.css'
import TabsCustomized from 'src/views/applications/ApplicationUserDetails'
import ComposePopup from 'src/views/apps/email/ComposePopup'
import CustomChip from 'src/@core/components/mui/chip'
import Spinner from 'src/@core/components/spinner'
import Icon from 'src/@core/components/icon'
import RenderClient from 'src/pages/components/renderclient'
import { Button, CardHeader, Typography, Box, Grid, Dialog, DialogContent, Card } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AlertDialog from 'src/@core/utils/alertDialog'


const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};


const fetchData = async ids => {
  if(!isValidObjectId(ids)){
    console.error("Inavlid User id")
  }
 else{
  try {
    const data = await axiosInstanceNew.get(`/get-motorcycle-details?motorcycleId=${ids}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    const foundUser = data.data.motorcycle.find(motorcycle => {
      return String(motorcycle._id).trim() === String(ids).trim()
    })
    return foundUser
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
 }
}
const statusObj = {
  1: { title: 'submitted', color: 'success' },
  2: { title: 'draft', color: 'info' },
  3: { title: 'inProgress', color: 'primary' },
  4: { title: 'rejected', color: 'error' }
}
const userTypeMapping = {
  submitted: 1,
  draft: 2,
  inProgress: 3,
  rejected: 4
}
const userDetails = ({ userId }) => {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [failureOpen, setFailureOpen] = useState(false)
  const [failureMessage, setFailureMessage] = useState('')
  const[successMessage,setSuccessMessage]=useState('')
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      if (!userId) return
      setLoading(true)
      try {
        const data = await fetchData(userId)
        if (data && Object.keys(data).length !== 0) {
          setUserData(data)
          setLoading(false)
          setFailureOpen(false)
        } else {
          setFailureOpen(true)
          setFailureMessage('Data not Found')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setFailureMessage('Something Went Wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchDataAndSetState()
  }, [userId])
  const handleClose = reason => {
    if (reason === 'backdropClick') {
      return
    }
    setFailureOpen(false)
    router.push('/dashboard/')
  }
  const theme = useTheme()
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const handleBack = () => {
    router.push('/dashboard/')
  }
  const [composeOpen, setComposeOpen] = useState(false)
  const toggleComposeOpen = () => setComposeOpen(!composeOpen)
  const composePopupWidth = mdAbove ? 754 : smAbove ? 520 : '100%'

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Typography variant='h6' sx={{ textTransform: 'none', marginLeft: '7px !important' }}>
            Auction Verify
          </Typography>
          <Button
            startIcon={<ArrowBackIcon sx={{ color: 'primary.main' }} />}
            onClick={handleBack}
            sx={{ border: 'none', color: 'black', marginBottom: '15px', marginLeft: '-5px !important' }}
          >
            <Typography variant='body2' sx={{ color: 'primary.main', textTransform: 'none' }}>
              Back to Overview
            </Typography>
          </Button>
          <Card>
            <CardHeader
              title={
                <Grid
                  container
                  spacing={1.5}
                  sx={{
                    alignItems: 'center',
                    justifyContent: { xs: 'center', md: 'space-between' },
                    flexDirection: 'row'
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: { xs: 'center', md: 'flex-start' }
                    }}
                  >
                    <RenderClient row={{ avatar: undefined, full_name: `${userData?.userDetails?.fullName}` }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                      <Typography variant='h6'>{userData?.userDetails?.fullName || '-'}</Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: 'center',
                      justifyContent: { xs: 'center', md: 'flex-start' },
                      gap: { xs: 3, md: 10 }
                    }}
                  >
                    <Typography
                      variant='body2'
                      sx={{
                        color: 'black',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {userData?.userDetails?.sellerType || '-'}
                    </Typography>
                    <CustomChip
                      size='small'
                      skin='light'
                      color={statusObj[userTypeMapping[userData?.status?.replace(/\s+/g, '')]]?.color || 'error'}
                      label={
                        statusObj[userTypeMapping[userData?.status?.replace(/\s+/g, '')]]?.title
                          .split(/(?=[A-Z])/)
                          .join(' ') || `${userData?.status || '-'}`
                      }
                      sx={{
                        height: 20,
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        borderRadius: '5px',
                        textTransform: 'capitalize'
                      }}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'center', md: 'flex-end' },
                      mt: { xs: 2, md: 0 }
                    }}
                  >
                    <Button
                      variant='outlined'
                      size='medium'
                      onClick={() => setComposeOpen(true)}
                      sx={{
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      Send a Message
                    </Button>
                  </Grid>
                </Grid>
              }
            />
            <TabsCustomized ids={userId} userData={userData} />
            <ComposePopup
              toMailId={userData?.email}
              mdAbove={mdAbove}
              composeOpen={composeOpen}
              composePopupWidth={composePopupWidth}
              toggleComposeOpen={toggleComposeOpen}
            />
          </Card>
        </>
      )}

      <AlertDialog open={failureOpen} errorMessage={failureMessage} handleClose={handleClose} successMessage={successMessage}/>
    </>
  )
}
export async function getServerSideProps(context) {
  return {
    props: { userId: context.query.userId || null }
  }
}

export default userDetails
