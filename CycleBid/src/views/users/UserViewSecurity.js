import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { styled, lighten, Box } from '@mui/system'
import Icon from 'src/@core/components/icon'
import axiosInstanceNew from 'src/axiosInstanceNew'
import AlertDialog from 'src/@core/utils/alertDialog'

const UserViewSecurity = ({ cognitoId, enabled }) => {
  const [enable, setEnable] = useState(enabled)
  const [values, setValues] = useState({
    selectedOption: enable ? 'option1' : 'option2'
  })

  const [dialogOpen, setDialogOpen] = useState(false)
  const[successMessage,setSuccessMessage]=useState('')
  const [failureMessage, setFailureMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dots, setDots] = useState('')

  const handleClick = async () => {
    setIsLoading(true);

    const action = values.selectedOption === 'option1' ? 'activateUser' : 'deactivateUser';
    try {
      const data = await axiosInstanceNew(`/users?action=${action}&username=${cognitoId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });

      if (data.status === 'error') {
        setFailureMessage(data.error);
        setDialogOpen(true);
        setSuccessMessage('')
      } else {
        setDialogOpen(true);
        setSuccessMessage(values.selectedOption === 'option1' ? 'User Activated Successfully' : 'User Deactivated Successfully' )
        setEnable(true);
      }
    } catch (error) {
      console.error(error);
      setDialogOpen(true)
      setFailureMessage(error.message)
      setSuccessMessage('')
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDialogOpen(false)
    setDialogOpen(false)
    setFailureMessage('')
  }

  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''))
    }, 500)
    return () => clearInterval(interval)
  }, [isLoading])

  const handleDropdownChange = event => {
    setValues({
      ...values,
      selectedOption: event.target.value
    })
  }

  const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    fontSize: '1.2rem',
    padding: '12px 24px',
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.primary.secondary
    },
    '&.Mui-selected': {
      backgroundColor: lighten(theme.palette.primary.main, 0.8),
      color: theme.palette.primary.light,
      '&:hover': {
        backgroundColor: lighten(theme.palette.primary.main, 0.8)
      }
    }
  }))

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
            title='Block User'
            sx={{
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          />
          <CardContent>
            <form onSubmit={e => e.preventDefault()}>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Select
                      labelId='user-view-security-dropdown'
                      defaultValue='option1'
                      value={values.selectedOption}
                      onChange={handleDropdownChange}
                      id='user-view-security-dropdown'
                      IconComponent={() => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Icon icon='ri:arrow-down-s-line' />
                          <Box sx={{ marginLeft: '8px' }} />
                        </Box>
                      )}
                    >
                      <StyledMenuItem value='option1'>Active</StyledMenuItem>
                      <StyledMenuItem value='option2'>Inactive/Block</StyledMenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button type='submit' variant='contained' onClick={() => handleClick()}>
                    {isLoading ? `Loading${dots}` : 'Done'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>

     <AlertDialog open={dialogOpen} handleClose={handleClose}  errorMessage={failureMessage} successMessage={successMessage}/>
    </Grid>
  )
}

export default UserViewSecurity
