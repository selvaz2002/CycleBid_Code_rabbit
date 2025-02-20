import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useAuth } from 'src/hooks/useAuth'

const AppBarContent = props => {
  const { hidden, settings, toggleNavVisibility } = props

  const auth = useAuth()

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
       {hidden && !settings.navHidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon='mdi:menu' />
          </IconButton>
        ) : null}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {auth.user && (
          <>
            <UserDropdown settings={settings} />
          </>
        )}
      </Box>
    </Box>
  )
}

export default AppBarContent