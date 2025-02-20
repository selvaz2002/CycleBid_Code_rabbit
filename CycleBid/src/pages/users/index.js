import Grid from '@mui/material/Grid'
import CardStatisticsLogo from 'src/views/ui/cards/statistics/CardStatisticsLogo'
import Spinner from 'src/@core/components/spinner';
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import axiosInstanceNew from 'src/axiosInstanceNew';
import { useEffect, useState } from 'react';
import UserDataTable from '../../views/users/UserDataTable';

const fetchData = async () => {
  try {
    const data = await axiosInstanceNew.get(`/users?action=getUsers&pageSize=10`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    if (data.status == 'error') {
      return { data: [] };
    }
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return { data: [] };
  }
};

const Users = ({ }) => {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await fetchData();
      if (data) {
        setTableData(data);
        setCardData([
          {
            stats: data.totalCount ?? '0',
            title: 'Active Users',
            chipColor: 'primary',
            borderColor: '#4161FE',
            trendNumber: '+15.6%',
            chipText: 'Total Users',
            icon: 'ri:group-line'
          },
          {
            stats: "0",
            trend: 'negative',
            title: 'Inactive Users',
            chipColor: 'success',
            borderColor: '#4161FE',
            trendNumber: '-25.5%',
            chipText: 'Blocked / Ban Users for Violations',
            icon: 'ri:group-line'
          },
          {
            stats: "0",
            title: 'Deleted Users',
            chipColor: 'warning',
            borderColor: '#FE4183',
            trendNumber: '+9.2%',
            chipText: 'Deleted Users from Auction list',
            icon: 'ri:user-add-line'
          },
        ]);
      }
      setLoading(false);
    };    

    fetchUserData();
  }, []);

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        {loading ? (
          <Spinner />
        ) : (
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <CardStatisticsLogo data={cardData} />
            </Grid>
            <Grid item xs={12}>
              <UserDataTable tableData={tableData} />
            </Grid>
          </Grid>
        )}
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

export default Users
