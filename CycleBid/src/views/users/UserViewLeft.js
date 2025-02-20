import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useMediaQuery } from '@mui/material'

const UserViewLeft = ({ userData }) => {
  const isLaptop = useMediaQuery('(min-width: 1024px)')

  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ pt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            {userData?.data?.[0]?.profileImage ? (
              <CustomAvatar
                src={userData.data[0].profileImage}
                variant='rounded'
                alt={userData.username}
                sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, borderRadius: '50%' }}
              />
            ) : (
              <CustomAvatar
                skin='light'
                variant='rounded'
                color='info'
                sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
              >
              </CustomAvatar>
            )}
            <Typography variant='h6' sx={{ mb: 2, whiteSpace: 'normal', wordBreak: 'break-word' }}>
              {userData.data?.[0].username ?? '-'}
            </Typography>
            <CustomChip
              skin='light'
              size='small'
              label={!userData.data ? '-' : 'Seller'}
              color={!userData.data ? 'secondary' : userData.data?.[0].enabled == 'buyer' ? 'info' : 'primary'}
              sx={{
                height: 20,
                fontWeight: 500,
                fontSize: '0.75rem',
                borderRadius: '5px',
                textTransform: 'capitalize'
              }}
            />
          </CardContent>
          <CardContent>
            <Divider sx={{ mt: theme => `${theme.spacing(0.5)} !important` }} />
            <Box sx={{ pt: 4, pb: 1 }}>
              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography
                  variant='subtitle2'
                  sx={{ mr: 2, color: 'text.primary', fontSize: { xs: '12px', sm: '13 px', md: '14px' } }}
                >
                  Username:
                </Typography>
                <Typography sx={{ fontSize: '15px', fontWeight: 'bold', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  {userData.data?.[0].username ?? '-'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', mb: 2.7, fontSize: { xs: '12px', sm: '13 px', md: '14px' } }}>
                <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                  Status:
                </Typography>
                <CustomChip
                  skin='light'
                  size='small'
                  label={!userData.data ? '-' : userData.data?.[0].enabled == true ? 'Active' : 'Inactive'}
                  color={!userData.data ? 'secondary' : userData.data?.[0].enabled == true ? 'success' : 'error'}
                  sx={{
                    height: 20,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    borderRadius: '5px',
                    textTransform: 'capitalize'
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', mb: 2.7, flexWrap: 'nowrap' }}>
                <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                  Contact:
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    display: 'flex',
                    flexWrap: 'nowrap',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {userData?.data?.[0]?.contactNumber ?? '-'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', mb: 2.7, flexWrap: 'nowrap' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                  Joined Date:
                </Typography>
                <Typography
                  sx={{
                    textTransform: 'capitalize',
                    fontSize: { xs: '12px', sm: '13 px', md: '14px' },
                    fontWeight: 'bold',
                    wordWrap: 'break-word',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    flexWrap: 'nowrap'
                  }}
                >
                  {isLaptop
                    ? userData.data?.[0].userCreateDate.slice(0, 10) ?? '-'
                    : userData.data[0].userCreateDate.slice(0, 10) ?? '-'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', mb: 2.7 }}>
                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Country:</Typography>
                <Typography sx={{ textTransform: 'capitalize', fontSize: '15px', fontWeight: 'bold' }}>
                  {userData?.country ?? '-'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ marginTop: '20px' }}>
          <CardContent
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              pb: '15px',
              justifyContent: 'space-between',
              flexDirection: 'column',
              wordWrap: 'break-word',
              whiteSpace: 'normal'
            }}
          >
            <Typography variant='h6' sx={{ mb: 5 }}>
              Email ID Verification
            </Typography>

            <Typography
              variant='body1'
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                flexDirection: 'row',
                fontWeight: '500',
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                overflowWrap: 'break-word',
                wordBreak: 'break-all',
                maxWidth: '100%'
              }}
            >
              {userData.data?.[0].email ?? '-'}
            </Typography>

            {userData?.data?.[0]?.userStatus == 'CONFIRMED' ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '10px'
                }}
              >
                <Typography
                  variant='body2'
                  sx={{
                    color: 'green',
                    display: 'flex',
                    alignItems: 'center',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal'
                  }}
                >
                  Verified
                  <IconButton aria-label='delete' sx={{ color: '#4bba43', marginLeft: '8px' }}>
                    <Icon icon='flat-color-icons:ok' width='24' height='24' />
                  </IconButton>
                </Typography>
              </Box>
            ) : (
              ''
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserViewLeft