import React from 'react'
import { useState } from 'react'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  CircularProgress
} from '@mui/material'
import TabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import UserViewLeft from './UserViewLeft'
import CardStatisticsCharacters from 'src/views/ui/cards/statistics/CardStatisticsCharacters'
import FallbackSpinner from 'src/@core/components/spinner'
import { UserAuctionData } from './UserAuctionData'

const StyledTabList = styled(TabList)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  position: 'relative',
  marginTop: theme.spacing(4),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  '& .MuiTab-root': {
    textTransform: 'none',
    fontSize: '16px',
    color: theme.palette.text.primary,
    padding: theme.spacing(2),
    minWidth: 'auto',
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '20px',
    right: '20px',
    height: '0.7px',
    backgroundColor: '#B9BEC4'
  },
  '& .Mui-selected': {
    color: theme.palette.primary.main
  }
}))

const Timeline = styled(MuiTimeline)(({ theme }) => ({
  margin: 0,
  padding: 0,
  marginLeft: theme.spacing(0.75),
  '& .MuiTimelineItem-root': {
    '&:before': {
      display: 'none'
    },
    '&:last-child': {
      minHeight: 60
    }
  }
}))

const UserViewOverview = ({ userData, bidData, sellData, dialogOpen }) => {
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  var cardData = [
    {
      stats: userData?.userVehicles?.[0]?.auction_bid ?? '0',
      title: 'Auction BID',
      chipColor: 'primary',
      borderColor: '#4161FE',
      trendNumber: '+15.6%',
      chipText: 'Total Auction Amount',
      icon: 'ri:group-line'
    },
    {
      stats: sellData?.data?.length ?? '0',
      trend: 'negative',
      title: 'Sell Vehicles ',
      chipColor: 'success',
      borderColor: '#8641FE',
      trendNumber: '-25.5%',
      chipText: `Sell ${sellData?.data?.length ?? '0'} vechicles`,
      icon: 'ri:group-line'
    },
    {
      stats: bidData?.data?.userBidsCount ?? '0',
      title: 'Buy Vehicles',
      chipColor: 'warning',
      borderColor: '#FE41CF',
      trendNumber: '+9.2%',
      chipText: `Buy ${bidData?.data?.userBids?.length ?? '0'} vechicles`,
      icon: 'ri:group-line'
    }
  ]

  return (
    <Grid container spacing={4} alignItems='stretch'>
      <Grid item xs={12} md={3}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <UserViewLeft userData={userData} />
        </Box>
      </Grid>

      <Grid item xs={12} md={9}>
        <Grid item xs={12}>
          <CardStatisticsCharacters data={cardData} />
        </Grid>
        <Card sx={{ mt: 3 }}>
          <TabContext value={value}>
            <StyledTabList
              onChange={handleChange}
              aria-label='customized tabs example'
              sx={{ marginLeft: '12px', padding: 'none' }}
            >
              <Tab
                label={`Sell (${sellData?.data?.length ?? '0'})`}
                value='1'
                sx={{ width: '95px', height: '35px', mr: 6 }}
              />
              <Tab
                label={`Buy (${bidData?.data?.userBids?.length ?? '0'})`}
                value='2'
                sx={{ width: '95px', height: '35px', mr: 6 }}
              />
            </StyledTabList>

            <TabPanel value='1'>
              <Box sx={{ p: 1 }}>
                {sellData?.status === 'error' || sellData?.data?.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', fontSize: '16px', color: '#FC3C53', m: 8 }}>
                    No Data Found
                  </Typography>
                ) : sellData?.data?.length ? (
                  sellData.data.map((item, index) => (
                    <React.Fragment key={index}>

                      <UserAuctionData
                        picture={item.motorcycleDetails?.pictures.length > 0 ? item.motorcycleDetails?.pictures?.[0].url : undefined}
                        bikeName={item?.motorcycleDetails?.bikeDetails?.make ?? '-'}
                        bikeModel={item?.motorcycleDetails?.bikeDetails?.model ?? '-'}
                        bidPrice={item.bidPrice}
                        bidEndingOn={item.bidEndingOn.slice(0, 10)}
                        notifiedMsg={item.notifiedMsg}
                        _id={item._id}
                      />

                      {index < sellData.data.length - 1 && <Divider sx={{ mb: 4, backgroundColor: '#B9BEC4' }} />}
                    </React.Fragment>
                  ))
                ) : (
                  dialogOpen ? <Typography textAlign="center" sx={{ margin: "20px 0px",color:"red" }}>No Data Found</Typography> : <FallbackSpinner sx={{ height: "auto" }} />
                )}
              </Box>
            </TabPanel>

            <TabPanel value='2'>
              <Box sx={{ p: 1 }}>
                {bidData?.status === 'error' || bidData?.data?.userBids?.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', fontSize: '16px', color: '#FC3C53', m: 8 }}>
                    No Data Found
                  </Typography>
                ) : bidData?.data?.userBids?.length ? (
                  bidData.data.userBids.map((item, index) => (
                    <React.Fragment key={index}>

                      <UserAuctionData
                        picture={item.motorcycleDetails?.pictures.length > 0 ? item.motorcycleDetails?.pictures?.[0].url : undefined}
                        bikeName={item?.motorcycleDetails?.bikeDetails?.make ?? '-'}
                        bikeModel={item?.motorcycleDetails?.bikeDetails?.model ?? '-'}
                        bidPrice={item.bidPrice}
                        bidEndingOn={item.auctionDetails?.bidEndingOn.slice(0, 10) ?? '-'}
                        notifiedMsg={item.notifiedMsg}
                        _id={item._id}
                      />

                      {index < bidData.data.userBids.length - 1 && (
                        <Divider sx={{ mb: 4, backgroundColor: '#B9BEC4' }} />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <CircularProgress />
                )}
              </Box>
            </TabPanel>
          </TabContext>
        </Card>

        <Card sx={{ mt: 3 }}>
          <CardHeader title='User Activity Timeline' />
          <CardContent>
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot sx={{ backgroundColor: '#1CACA3' }} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                      Password Changed
                    </Typography>
                    <Typography variant='caption'>12 min ago</Typography>
                  </Box>
                  <Typography variant='body2'>User updated his Password </Typography>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot sx={{ backgroundColor: '#1CACA3' }} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                      User has changed his username
                    </Typography>
                    <Typography variant='caption'>45 min ago</Typography>
                  </Box>
                  <Typography variant='body2' sx={{ mb: 2 }}>
                    Richard joe changes his Username to Richard Payne
                  </Typography>

                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot sx={{ backgroundColor: '#1CACA3' }} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                      Commented to{' '}
                      <Typography component='span' sx={{ color: '#1E70EB' }}>
                        Richard
                      </Typography>{' '}
                      seller bike 2021 MV Agusta
                    </Typography>

                    <Typography variant='caption'>2 day ago</Typography>
                  </Box>
                  <Typography variant='body2'>6 team members in a project</Typography>
                </TimelineContent>
              </TimelineItem>

            </Timeline>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserViewOverview
