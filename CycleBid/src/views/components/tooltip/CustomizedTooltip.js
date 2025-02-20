import { styled } from '@mui/system'
import Tooltip,{ tooltipClasses } from '@mui/material/Tooltip'


  const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.3)',
      fontSize: 11,
      minWidth: '426px',
      maxWidth: '300px',
      borderRadius: '20px',
      minHeight: '200px',
      position: 'relative'
    },
    [`& .${tooltipClasses.tooltip}::before`]: {
      content: '""',
      position: 'absolute',
      top: '-15px',
      left: '80%',
      transform: 'translateX(-50%)',
      width: '40px',
      height: '20px',
      backgroundColor: '#FFF',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      boxShadow: '1px 1px 12px rgba(0, 0, 0, 0.7) !important'
    }
  })
)

export default LightTooltip
