import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useSettings } from 'src/@core/hooks/useSettings'
import SidebarLeft from 'src/views/users/SidebarLeft'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

import {
  fetchMails,
  handleSelectAllMail
} from 'src/store/apps/email'
import MailDetails from './MailDetails'

const EmailAppLayout = ({ folder, label, userData }) => {
  const [query, setQuery] = useState('')
  const [composeOpen, setComposeOpen] = useState(false)
  const [mailDetailsOpen, setMailDetailsOpen] = useState(false)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [mailSelected, setMailSelected] = useState(null)
  const [isComposeOpen, setIsComposeOpen] = useState(false)

  const theme = useTheme()
  const { settings } = useSettings()
  const dispatch = useDispatch()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const store = useSelector(state => state.email)

  const leftSidebarWidth = 260
  const { skin } = settings

  const routeParams = {
    label: label || '',
    folder: folder || 'inbox'
  }

  const toggleCompose = () => setIsComposeOpen(prev => !prev)

  useEffect(() => {
    dispatch(fetchMails({ q: query || '', folder: routeParams.folder, label: routeParams.label }))
  }, [dispatch, query, routeParams.folder, routeParams.label])
  const toggleComposeOpen = () => setComposeOpen(!composeOpen)
  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  return (
    <Grid
      spacing={6}
      sx={{
        width: '100%',
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        height: '100vh',
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
      }}
    >
      <Grid
        xs={0}
        md={1}
        lg={3}
        sx={{
          height: '100% !important',
          backgroundColor: '#F7F7F9',
          borderRight: '1px solid #e0e0e0',
          width: { xs: '60px', sm: '80px', md: '100px !important' },
        }}
      >
        {lgAbove ? null : (
          <IconButton onClick={handleLeftSidebarToggle} sx={{ mr: 2, ml: 2 }}>
            <Icon icon='mdi:menu' fontSize={30} color='black ' />
          </IconButton>
        )}

        <SidebarLeft
          store={store}
          hidden={hidden}
          lgAbove={lgAbove}
          dispatch={dispatch}
          mailDetailsOpen={mailDetailsOpen}
          leftSidebarOpen={leftSidebarOpen}
          leftSidebarWidth={leftSidebarWidth}
          toggleComposeOpen={toggleComposeOpen}
          setMailDetailsOpen={setMailDetailsOpen}
          handleSelectAllMail={handleSelectAllMail}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          setMailSelected={setMailSelected}
          toggleCompose={toggleCompose}
          setIsComposeOpen={setIsComposeOpen}
          setLeftSidebarOpen={setLeftSidebarOpen}
          emails={[]}
        />
      </Grid>
      <Grid xs={11} md={11} lg={9}>
        <MailDetails
          email={mailSelected}
          isComposeOpen={isComposeOpen}
          toggleCompose={toggleCompose}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          setComposeOpen={setComposeOpen}
        />
      </Grid>
    </Grid>
  )
}

export default EmailAppLayout