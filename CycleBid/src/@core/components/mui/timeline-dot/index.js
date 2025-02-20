import { useTheme } from '@mui/material/styles'
import MuiTimelineDot from '@mui/lab/TimelineDot'
import useBgColor from 'src/@core/hooks/useBgColor'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const TimelineDot = props => {
  const { sx, skin, color, variant } = props
  const theme = useTheme()
  const bgColors = useBgColor()

  const colors = {
    primary: {
      boxShadow: 'none',
      color: theme.palette.primary.main,
      backgroundColor: bgColors.primaryLight.backgroundColor
    },
    secondary: {
      boxShadow: 'none',
      color: theme.palette.secondary.main,
      backgroundColor: bgColors.secondaryLight.backgroundColor
    },
    success: {
      boxShadow: 'none',
      color: theme.palette.success.main,
      backgroundColor: bgColors.successLight.backgroundColor
    },
    error: {
      boxShadow: 'none',
      color: theme.palette.error.main,
      backgroundColor: bgColors.errorLight.backgroundColor
    },
    warning: {
      boxShadow: 'none',
      color: theme.palette.warning.main,
      backgroundColor: bgColors.warningLight.backgroundColor
    },
    info: {
      boxShadow: 'none',
      color: theme.palette.info.main,
      backgroundColor: bgColors.infoLight.backgroundColor
    },
    grey: {
      boxShadow: 'none',
      color: theme.palette.grey[500],
      backgroundColor: hexToRGBA(theme.palette.grey[500], 0.12)
    }
  }

  return (
    <MuiTimelineDot
      {...props}
      sx={color && skin === 'light' && variant === 'filled' ? Object.assign(colors[color], sx) : sx}
    />
  )
}
TimelineDot.defaultProps = {
  color: 'grey',
  variant: 'filled'
}

export default TimelineDot