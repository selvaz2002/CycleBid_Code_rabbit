import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardStatisticsCharacters from 'src/views/ui/cards/statistics/CardStatisticsCharacters'
import AuctionTable from 'src/views/auctionview/AuctionTable'
import Spinner from 'src/@core/components/spinner'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import axiosInstanceNew from 'src/axiosInstanceNew'
import { useEffect, useState } from 'react'

const fetchData = async () => {
  try {
    const data = await axiosInstanceNew.get(`/get-auctions?sortBy=newlyAdded&pageSize=10`)
    if (data.status == 'error') {
      return { data: [] }
    }
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return { data: [] }
  }
}

const fetchSoldData = async () => {
  try {
    const data = await axiosInstanceNew.get(`/get-auctions?sortBy=recentlySold`)
    if (data.status == 'error') {
      return { data: [] }
    }
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return { data: [] }
  }
}

const fetchRejectedData = async () => {
  try {
    return { data: [] }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { data: [] }
  }
}

const AuctionDashboard = () => {
  const [cardData, setCardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [tableData, setTableData] = useState([])

  useEffect(() => {

    const fetchDataAndSetState = async () => {
      setLoading(true)

     try {
      const data = await fetchData()
      const soldData = await fetchSoldData()
      const rejectData = await fetchRejectedData()

      if (data.data.length !== 0) {
        setTableData({
          auctionData: data,
          auctionSoldData: soldData,
          auctionRejectData: rejectData.data
        })
        setCardData([
          {
            stats: data?.pagination?.totalItems ?? 0,
            title: 'Ongoing',
            chipColor: 'primary',
            borderColor: '#4161FE',
            trendNumber: '+15.6%',
            chipText: 'Total Ongoing Auctions',
            icon: 'ri:group-line',
            src: '/images/cards/card-stats-img-1.png'
          },
          {
            stats: soldData?.pagination?.totalItems ?? 0,
            trend: 'negative',
            title: 'Past/Sold Auctions',
            chipColor: 'success',
            borderColor: '#7D41FE',
            trendNumber: '-25.5%',
            chipText: 'Sold Auctions',
            icon: 'ri:user-add-line',
            src: '/images/cards/card-stats-img-2.png'
          },
          {
            stats: rejectData?.data?.length ?? 0,
            title: 'Rejected Auctions',
            chipColor: 'error',
            borderColor: '#ff4d49',
            trendNumber: '+9.2%',
            chipText: 'Total Rejected Auctions',
            icon: 'ri:user-follow-line',
            src: '/images/cards/card-stats-img-3.png'
          }
        ])
      }
      else{
        setLoading(true)
      }

     } catch (error) {
      console.log(error)
     }
     finally{
      setLoading(false)
     }
    }

    fetchDataAndSetState()
  }, [])

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        {loading ? (
          <Spinner />
        ) : (
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <CardStatisticsCharacters data={cardData} />
            </Grid>
            <Grid item xs={12}>
              <Card>
                <AuctionTable tableData={tableData} />
              </Card>
            </Grid>
          </Grid>
        )}
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

export default AuctionDashboard
