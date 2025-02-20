import Grid from '@mui/material/Grid'

import CardStatisticsLogo from 'src/@core/components/card-statistics/cards-stats-with-logo'

const CardStatsLogo = ({ data }) => {
  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} sm={6} lg={4}>
          <CardStatisticsLogo data={data[0]} />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <CardStatisticsLogo data={data[1]} />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <CardStatisticsLogo data={data[2]} />
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default CardStatsLogo
