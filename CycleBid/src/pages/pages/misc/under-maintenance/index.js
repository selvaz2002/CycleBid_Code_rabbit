import Link from 'next/link'
import { Button, Typography, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))
const Img = styled('img')(({ theme }) => ({
  marginTop: theme.spacing(15),
  marginBottom: theme.spacing(15),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  }
}))
const UnderMaintenance = () => {
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h5' sx={{ mb: 2.5, fontSize: '1.5rem !important' }}>
            Under Maintenance! 🚧
          </Typography>
          <Typography variant='body2'>
            Sorry for the inconvenience but we&prime;re performing some maintenance at the moment
          </Typography>
        </BoxWrapper>
        <Img height='500' alt='under-maintenance-illustration' src='/images/pages/misc-under-maintenance.png' />
        <Button href='/' component={Link} variant='contained' sx={{ px: 5.5 }}>
          Back to Home
        </Button>
      </Box>
      <FooterIllustrations image={`/images/pages/misc-under-maintenance-object.png`} />
    </Box>
  )
}
UnderMaintenance.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default UnderMaintenance
