import { useState } from 'react'
import { Button, TextField, InputLabel, IconButton, Box, FormControl, OutlinedInput, FormHelperText, InputAdornment, Typography, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import axiosInstanceNew from 'src/axiosInstanceNew'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const LoginIllustration = styled('img')(({ theme }) => ({
  width: '100%',
  transform: 'scaleX(-1)',
  zIndex: "-2",
  height: '100%',
  objectFit: 'cover',
  filter: 'grayscale(100%) brightness(1.2) contrast(1.5)',
  opacity: 0.8,
}))
const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(3) }
}))
const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
})
const Form = styled('form')(({ theme }) => ({
  maxWidth: 500,
  padding: theme.spacing(12),
  borderRadius: theme.shape.borderRadius,
  border: `2px solid ${theme.palette.divider}`,
  backgroundColor: "white"
}))
const LoginPage = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  const onSubmit = async (data) => {
    setLoading(true)
    try {
      setErrorMessage("");
      const response = await axiosInstanceNew.post('/login', {
        email: data.email,
        password: data.password,
      });
      const errorMsg = response.message
      setErrorMessage(errorMsg);
      const token = response.data.accessToken;
      const email = data.email
      const id = 1;
      const role = "admin"
      const user_name = "admin"
      const full_name = "admin"
      if (!token) {
        throw new Error('Token is missing in the API response');
      }
      if (rememberMe) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userData', JSON.stringify({ id, role, user_name, full_name, email }));
      }
      const returnUrl = router.query.returnUrl
      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
      router.replace(redirectURL)
      router.reload();
    } catch (error) {
      console.error('Login Error:', error);
      if (error.response?.data?.message) {
        const errorMsg = error.response.data.message
        setErrorMessage(errorMsg);
      }
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <Box
      className="content-center"
      sx={{
        flex: 1,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          zIndex: '-2',
          left: 0,
        }}
      >
        <LoginIllustration alt="login-illustration" src={`/images/login/bike.png`} />
      </Box>
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
        <Grid item xs={12} sm={6} lg={6} sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
          <Typography variant="h3" sx={{
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: "#fff",
          }}>
            Welcome to Cyclebids
          </Typography>
          <Typography variant="h4" sx={{
            fontWeight: '200',
            color: '#fff',
            marginBottom: '2rem',
          }}>
            Best online auctions motorcycles
          </Typography>
          <Typography variant="h2" sx={{
            fontWeight: 'bold',
            display: 'inline-block',
            background: 'linear-gradient(to right, #2176EA, #55EAD7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Browse . View . Bid
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={6} sx={{ justifyItems: 'center', boxSizing: "border-box" }}>
          <Form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              position: 'relative',
              padding: { xs: 3, sm: 10 },
              width: '100%',
              maxWidth: 450,
              margin: '0 auto',
            }}
          >
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <img alt='error-illustration' src='/images/logos/cyclebid-logo.svg' Width='220' height='100' />
              </Box>
              <TypographyStyled variant="h5" sx={{ marginTop: '1 !important', color: "black" }}>Welcome to CycleBid</TypographyStyled>
              <TypographyStyled variant="body2" sx={{ marginTop: '1 !important', padding: "5px", paddingBottom: "10px" }}>Please sign-in Your Account</TypographyStyled>
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label="Email"
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder="E-Mail"
                  />
                )}
              />
              {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="auth-login-v2-password" error={Boolean(errors.password)}>
                Password
              </InputLabel>
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label="Password"
                    onChange={onChange}
                    id="auth-login-v2-password"
                    error={Boolean(errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton edge="end" onMouseDown={e => e.preventDefault()} onClick={() => setShowPassword(!showPassword)}>
                          <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id="">
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
            <Box sx={{ mb: 4, mt: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            </Box>
            {errorMessage && (
              <Typography variant="body2" sx={{ color: errorMessage === 'Login successful' ? 'success.main' : 'error.main', textAlign: 'center', mb: 2 }}>
                {errorMessage}
              </Typography>
            )}
            <Button fullWidth size="large" type="submit" variant="contained" sx={{ mb: 7 }}>
              {loading ? "Logging In..." : "Login"}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            </Box>
          </Form>
        </Grid>
      </Grid>
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage





