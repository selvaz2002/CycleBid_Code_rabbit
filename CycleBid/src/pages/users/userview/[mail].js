import Grid from '@mui/material/Grid'
import TabList from '@mui/lab/TabList'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import Icon from 'src/@core/components/icon'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import UserViewBilling from 'src/views/users/UserViewBilling'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import UserViewOverview from 'src/views/users/UserViewOverview'
import UserViewSecurity from 'src/views/users/UserViewSecurity'
import UserMailView from 'src/views/users/UserMailView'
import { useRouter } from 'next/router'
import { Typography, Button, Box, Link  } from '@mui/material'
import Spinner from 'src/@core/components/spinner'
import 'remixicon/fonts/remixicon.css'
import axiosInstanceNew from 'src/axiosInstanceNew'
import { useEffect, useState } from 'react'
import AlertDialog from 'src/@core/utils/alertDialog'

const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1)
  }
}))

const UserView = ({ tab, mail }) => {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState(tab || 'overview')
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState([])
  const [sellData, setSellData] = useState([])
  const [bidData, setBidData] = useState([])
  const [cognitoId, setCognitoId] = useState(null)
  const [enabled, setEnabled] = useState(false)
  const [fetchTrigger, setFetchTrigger] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const[successMessage,setSuccessMessage]=useState('')

  const handleBack = () => {
    router.push('/users/')
  }

  const handleChange = (event, value) => {
    setActiveTab(value.toLowerCase())
  }

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [tab])

  const fetchData = async mail => {
    setLoading(true)
    try {
      const data = await axiosInstanceNew.get(`/users?action=getUsers&searchByEmail=${mail}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (data && Object.keys(data).length !== 0 && data.data.length != 0) {
        setUserData(data)
        setLoading(false)
      }
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
      return null
    }
  }

  const fetchBidData = async cognitoId => {
    setLoading(true)

    try {
      if (cognitoId) {
        const data = await axiosInstanceNew.get(`/get-biddings?username=${cognitoId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        if (data && Object.keys(data).length !== 0) {
          setBidData(data)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const fetchSellData = async cognitoId => {
    setLoading(true)
    try {
      if (cognitoId) {
        const data = await axiosInstanceNew.get(`/get-auctions?username=${cognitoId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        if (data && Object.keys(data).length !== 0) {
          setSellData(data)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const data = async () => {
      setLoading(true)
      try {
        const fetch = await fetchData(mail)
        if (fetch && fetch.data && fetch.data.length > 0) {
          const cognitoId = await fetch.data[0].cognitoUserId
          setEnabled(fetch.data[0].enabled)
          setCognitoId(cognitoId)
          fetchBidData(cognitoId)
          fetchSellData(cognitoId)
        } else {
          console.error('No user data available or unexpected response format', fetch)
          setErrorMessage('Data not Found')
          setDialogOpen(true)
          setSuccessMessage('')
        }
      } catch (error) {
        console.error('error', error)
      } finally {
        setLoading(false)
      }
    }
    data()
  }, [mail, fetchTrigger])

  const handleClose = reason => {
    if (reason === 'backdropClick') {
      return
    }
    setDialogOpen(false)
    router.push('/users')
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Grid container spacing={0}>
          <Grid item xs={12} md={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: '20px', sm: '24px' },
                    color: '#262B43E5',
                    fontWeight: '500',
                    marginBottom: '4px'
                  }}
                >
                  {userData?.data?.[0]?.username}
                </Typography>
                <Link
                  onClick={handleBack}
                  sx={{
                    border: 'none',
                    color: 'black',
                    marginBottom: '20px',
                    marginLeft: '-5px !important',
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'none',
                      cursor: 'pointer'
                    }
                  }}
                >
                  <ArrowBackIcon sx={{ color: 'primary.main', marginRight: '8px', fontSize: '14px' }} />
                  <Typography variant='body2' sx={{ color: 'primary.main', textTransform: 'none', fontSize: '14px' }}>
                    Back to All Users /
                  </Typography>
                </Link>
              </Box>
              <Button
                variant='outlined'
                color='error'
                sx={{
                  size: 'small',
                  fontSize: { xs: '13px', sm: '15px', textTransform: 'none' },
                  mt: { xs: 2, sm: 0 }
                }}
              >
                Delete User
              </Button>
            </Box>

            <TabContext value={activeTab} sx={{ borderBottom: 'none !important' }}>
              <TabList
                variant='scrollable'
                scrollButtons='none'
                onChange={handleChange}
                aria-label='forced scroll tabs example'
                sx={{
                  paddingBottom: '20px',
                  '& .MuiTabs-indicator': {
                    display: 'none !important',
                    border: 'none !important'
                  }
                }}
              >
                <Tab
                  value='overview'
                  label='Overview'
                  icon={<Icon icon='ri:group-line' />}
                  onClick={() => setFetchTrigger(prev => prev + 1)}
                  sx={{
                    border: activeTab === 'overview' ? '2px solid' : '0px',
                    borderColor: activeTab === 'overview' ? 'primary.main' : 'grey.500',
                    borderRadius: '8px',
                    backgroundColor: activeTab === 'overview' ? 'primary.main' : 'none',
                    color: activeTab === 'overview' ? 'white !important' : '#262B43E5',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      borderColor: 'primary.main',
                      color: 'white'
                    },
                    padding: '6px 16px',
                    minWidth: 'auto',
                    marginRight: 2,
                    textTransform: 'none'
                  }}
                />
                <Tab
                  value='security'
                  label='Security'
                  icon={<Icon icon='mdi:lock-outline' />}
                  sx={{
                    border: activeTab === 'security' ? '2px solid' : '0px',
                    borderColor: activeTab === 'security' ? 'primary.main' : 'grey.500',
                    borderRadius: '8px',
                    backgroundColor: activeTab === 'security' ? 'primary.main' : 'none',
                    color: activeTab === 'security' ? 'white !important' : '#262B43E5',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      borderColor: 'primary.main',
                      color: 'white'
                    },
                    padding: '6px 16px',
                    minWidth: 'auto',
                    marginRight: 2,
                    borderBottom: 'none !imporant',
                    textTransform: 'none'
                  }}
                />
                <Tab
                  value='card-details'
                  label='Card Details'
                  icon={<Icon icon='mdi:bookmark-outline' />}
                  sx={{
                    border: activeTab === 'card-details' ? '2px solid' : '0px',
                    borderColor: activeTab === 'card-details' ? 'primary.main' : 'grey.500',
                    borderRadius: '8px',
                    backgroundColor: activeTab === 'card-details' ? 'primary.main' : 'transparent',
                    color: activeTab === 'card-details' ? 'white !important' : '#262B43E5',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      borderColor: 'primary.main',
                      color: 'white'
                    },
                    padding: '4px 20px',
                    minWidth: 'auto',
                    marginRight: 2,
                    textTransform: 'none'
                  }}
                />

                <Tab
                  value='messages'
                  label='Messages'
                  icon={<Icon icon='ri:link' />}
                  sx={{
                    border: activeTab === 'messages' ? '2px solid' : '0px',
                    borderColor: activeTab === 'messages' ? 'primary.main' : 'grey.500',
                    borderRadius: '8px',
                    backgroundColor: activeTab === 'messages' ? 'primary.main' : 'none',
                    color: activeTab === 'messages' ? 'white !important' : '#262B43E5',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      borderColor: 'primary.main',
                      color: 'white'
                    },
                    padding: '6px 16px',
                    minWidth: 'auto',
                    marginRight: 2,
                    textTransform: 'none'
                  }}
                />
              </TabList>

              <TabPanel sx={{ p: 0 }} value='overview'>
                <UserViewOverview
                  userData={userData ?? []}
                  sellData={sellData ?? null}
                  bidData={bidData ?? null}
                  dialogOpen={dialogOpen}
                />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='security'>
                <UserViewSecurity cognitoId={cognitoId} enabled={enabled} />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='card-details'>
                <UserViewBilling userData={userData} />
              </TabPanel>
              <TabPanel sx={{ p: 0 }} value='messages'>
                <UserMailView />
              </TabPanel>
            </TabContext>

            <AlertDialog open={dialogOpen} handleClose={handleClose} errorMessage={errorMessage} successMessage={successMessage} />
          </Grid>
        </Grid>
      )}
    </>
  )
}
export async function getServerSideProps(context) {
  return {
    props: { mail: context.query.mail || null }
  }
}

export default UserView
