import Grid from '@mui/material/Grid'

import CardStatisticsCharacter from 'src/@core/components/card-statistics/card-stats-with-image'

const CardStatsCharacter = ({ data }) => {
  if (data && data.length > 0) {
    return (
      <Grid container spacing={6}>
        {data.map((item, index) => {
          const gridSize = Math.floor(12 / data.length)
          return (
            <Grid item xs={12} sm={gridSize} key={index}>
              <CardStatisticsCharacter data={item} />
            </Grid>
          )
        })}
      </Grid>
    )
  } else {
    return null
  }
}

export default CardStatsCharacter
