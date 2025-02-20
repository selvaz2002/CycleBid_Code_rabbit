import Link from 'next/link'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import TableFilter from 'src/views/table/data-grid/TableFilter'
import ChartjsLineChart from 'src/views/charts/chartjs/ChartjsAreaChart'
import 'chart.js/auto'

const Table = () => {
  const theme = useTheme()
  const whiteColor = '#fff'
  const primaryColor = '#836af9'
  const lineChartYellow = '#d4e157'
  const lineChartPrimary = '#787EFF'
  const lineChartWarning = '#ff9800'
  const borderColor = theme.palette.divider
  const labelColor = theme.palette.text.disabled
  const legendColor = theme.palette.text.secondary
  return (
    <Grid container spacing={6}>
      <Grid item xs={6} sm={3} md={2}>
      </Grid>
      <Grid item xs={12}>
        <ChartjsLineChart
          white={whiteColor}
          labelColor={labelColor}
          success={lineChartYellow}
          borderColor={borderColor}
          legendColor={legendColor}
          primary={lineChartPrimary}
          warning={lineChartWarning}
          blue={primaryColor}
        />
      </Grid>
      <Grid item xs={12}>
        <TableFilter />
      </Grid>

    </Grid>
  )
}

export default Table
