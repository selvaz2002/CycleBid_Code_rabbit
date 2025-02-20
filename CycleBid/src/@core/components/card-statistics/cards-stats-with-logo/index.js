import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { lighten } from '@mui/system';

import CustomChip from 'src/@core/components/mui/chip'
import { Icon } from '@iconify/react';

const CardStatsLogo = ({ data }) => {
  const { title, chipText, stats = 'positive', borderColor, icon } = data

  return (
    <Card sx={{ overflow: 'visible', position: 'relative', borderBottom: `4px solid ${borderColor}` }}>
      <CardContent sx={{ pb: '1 !important' }}>

        <Grid container >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>

          </Box>
          <Grid item xs={6} sx={{}}>

            <Typography sx={{ mb: 2, fontWeight: 600, whiteSpace: 'nowrap' }}>{title}</Typography>
            <Typography variant='h4' sx={{ mr: 1.5, mb: 2, fontWeight: "800", color: "black" }}>
              {stats}
            </Typography>

          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
              <Box
                sx={{
                  borderRadius: "10px", backgroundColor: `${lighten(borderColor, 0.8)}`, opacity: "0.5", color: "black", padding: "8px", fontWeight: "bold"
                }}
              >
                <Icon icon={icon} style={{ color: borderColor, fontSize: '26px', fontWeight: 'bold' }} />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <CustomChip
          skin='light'
          size='small'
          label={chipText}
          borderColor={borderColor}
          sx={{ mb: 1, height: 0, fontWeight: 500, fontSize: '0.9rem' }}
        />
      </CardContent>
    </Card>

  )
}

export default CardStatsLogo