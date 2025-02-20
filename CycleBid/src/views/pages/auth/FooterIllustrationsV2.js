import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

const MaskImg = styled('img')(({ theme }) => ({
  zIndex: -1,
  bottom: '7%',
  width: '100%',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    bottom: '17.5%'
  }
}))

const FooterIllustrationsV2 = props => {
  const { image } = props

  const theme = useTheme()

  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const src = image || `/images/pages/auth-v2-login-mask-${theme.palette.mode}.png`
  if (!hidden) {
    return <>{image && typeof image !== 'string' ? image : <MaskImg alt='mask' src={src} />}</>
  } else {
    return null
  }
}

export default FooterIllustrationsV2
