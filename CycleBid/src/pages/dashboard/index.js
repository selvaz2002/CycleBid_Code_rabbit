import Grid from '@mui/material/Grid'
import CardStatisticsCharacters from 'src/views/ui/cards/statistics/CardStatisticsCharacters'
import ApplicationDataTable from 'src/views/applications/ApplicationDataTable'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import axiosInstanceNew from 'src/axiosInstanceNew'
import Spinner from 'src/@core/components/spinner';
import { useEffect, useState } from 'react';
const fetchData = async () => {
  try {
    const data = await axiosInstanceNew.get(
      '/get-motorcycle-details?page=1&limit=10', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    return data
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
const fetchUserData = async () => {
  try {
    const data = await axiosInstanceNew.get(
      '/users?action=getUsers', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    return data
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
const CardStatistics = ({ }) => {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  useEffect(() => {
    setLoading
    const fetchDataAndSetState = async () => {
      const data = await fetchData();
      const userData = await fetchUserData();
      if (data) {
        const motorcycleData = data.data.motorcycle || [];
        const bikeDetailsData = Array.isArray(data.data.bikeDetails) ? data.data.bikeDetails : [];
        const combinedData = [...motorcycleData, ...bikeDetailsData];
        setTableData(combinedData);
        setPaginationData(data.data.pagination);
        setCardData([
          {
            stats: data?.data?.pagination?.totalItems ?? 0,
            trend: 'negative',
            title: 'Auctions',
            chipColor: 'success',
            borderColor: '#7D41FE',
            trendNumber: '-25.5%',
            chipText: 'Total Completed Auctions',
            icon: 'ri:user-add-line',
            src: '/images/cards/card-stats-img-2.png'
          },
          {
            stats: "$32M",
            title: 'Auctions Revenue',
            chipColor: 'warning',
            borderColor: '#23C333',
            trendNumber: '+9.2%',
            chipText: 'Revenue Generated till now',
            icon: 'ri:user-follow-line',
            src: '/images/cards/card-stats-img-3.png'
          },
          {
            stats: userData?.totalCount,
            title: 'User Growth',
            chipColor: 'primary',
            borderColor: '#4161FE',
            trendNumber: '+15.6%',
            chipText: 'Total Users',
            icon: 'ri:group-line',
            src: '/images/cards/card-stats-img-1.png'
          },
        ]);
      }
      setLoading(false);
    };
    fetchDataAndSetState();
  }, []);
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
              <ApplicationDataTable tableData={tableData} paginationData={paginationData} />
            </Grid>
          </Grid>
        )}
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}
export default CardStatistics

