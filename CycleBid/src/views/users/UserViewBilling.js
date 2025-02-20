import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CustomChip from 'src/@core/components/mui/chip'
import 'react-credit-cards/es/styles-compiled.css'

const UserViewBilling = ({userData}) => {

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card
          sx={{
            width: { xs: '100%', sm: '90%', md: '765px' },
            height: { xs: 'auto', md: '278px' },
            boxShadow: 3,
            p: 2
          }}
        >
          <CardHeader
            title='Payment Methods'
            sx={{
              color: '#262B43E5 !important',
              marginBottom: '8px',
              marginTop: '5px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          />
          <CardContent>
            {userData.data.map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 5,
                  display: 'flex',
                  borderRadius: 1,
                  flexDirection: ['column', 'row'],
                  justifyContent: ['space-between'],
                  alignItems: ['flex-start', 'center'],
                  mb: index !== userData.data[0].paymentDetails.length - 1 ? 4 : undefined,
                  border: theme => `1px solid ${theme.palette.divider}`
                }}
              >
                <div>
                  <img height='25' alt='card' src='/images/logos/mastercard.png' />
                  <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600 ,whiteSpace: 'normal', wordBreak: 'break-word'}}>{item.username ?? '-'}</Typography>
                    {item.status ? (
                      <CustomChip
                        skin='light'
                        size='small'
                        label={item.status}
                        color='primary'
                        sx={{
                          height: 20,
                          ml: 2,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          borderRadius: '15px',
                          padding: '13px 2px'
                        }}
                      />
                    ) : null}
                  </Box>
                  <Typography variant='body2'>
                    **** **** **** {item?.paymentDetails?.[0]?.cardLast4 ?? '0000'}
                  </Typography>
                </div>

                <Box sx={{ mt: [3, 0], textAlign: ['start', 'end'] }}>
                  <Typography variant='body2' sx={{ mt: 5,whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    Card expires at - {item?.paymentDetails?.[0]?.cardExpiry ?? '00/00'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserViewBilling