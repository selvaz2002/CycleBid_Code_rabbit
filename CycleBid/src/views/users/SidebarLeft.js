import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { CardHeader } from '@mui/material'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'

const SidebarLeft = props => {

  const {
    store,
    hidden,
    lgAbove,
    dispatch,
    leftSidebarOpen,
    leftSidebarWidth,
    toggleComposeOpen,
    setMailDetailsOpen,
    handleSelectAllMail,
    handleLeftSidebarToggle,
    setMailSelected,
    toggleCompose,
    setIsComposeOpen,
    setLeftSidebarOpen,
    emails
  } = props

  const handleToggleSidebar = () => {
    setLeftSidebarOpen((prev) => !prev);
  }

  const handleEmailClick = email => {
    setMailSelected(email)
    setIsComposeOpen(false)
  }

  return (
    <>
      <Drawer
        open={leftSidebarOpen}
        onClose={handleToggleSidebar}
        variant='permanent'
        ModalProps={{
          disablePortal: true,
          keepMounted: true
        }}
        sx={{
          zIndex: 99,
          height: '100vh',
          display: { xs: leftSidebarOpen ? 'block' : 'none', lg: 'block' },
          position: 'static',
          '& .MuiDrawer-paper': {
            boxShadow: 'none',
            width: leftSidebarWidth,
            zIndex: 99,
            position: lgAbove ? 'static' : 'absolute',
            height: '100%',
            width: { xs: 'auto', md: 'auto' }
          }
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 5 },
            backgroundColor: '#F7F7F9'
          }}
        >
          <Button fullWidth variant='contained' onClick={toggleCompose}>
            <IconButton onClick={handleToggleSidebar} sx={{ display: { xs: "flex", lg: "none" } }}>
              <Icon icon='material-symbols:arrow-back-ios' color='white' width='25' height='18' />
            </IconButton>
            Compose
          </Button>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            backgroundColor: '#ffffff',
            padding: { xs: 2, sm: 3, md: 2 }
          }}
        >
          <CardHeader
            title={
              <Typography
                sx={{
                  color: '#1E70EB',
                  cursor: 'pointer',
                  fontSize: '18px',
                  margin: '0',
                  padding: '-5px !important'
                }}
              >
                Messages
              </Typography>
            }
          />

          {emails.map(email => (
            <Box
              key={email.id}
              sx={{
                cursor: 'pointer',
                padding: ' 5px 18px',

                display: 'flex',
                justifyContent: 'space-between',

                '&:hover': { backgroundColor: '#7777771A', borderRadius: '10px' }
              }}
              onClick={() => handleEmailClick(email)}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', padding: '7px 2px' }}
                onClick={handleToggleSidebar}
              >
                <Typography variant='body2' sx={{ fontSize: '16px', color: '#262B43E5' }}>
                  {email.from.name}
                </Typography>
                <Typography variant='body2' sx={{ fontSize: '14px', color: '#262B43B2' }}>
                  {email.subject.slice(0, 20)}
                  {email.subject.length > 20 && '...'}

                </Typography>
              </Box>

              <Typography variant='body2' sx={{ color: '#262B4366', fontSize: '13px', padding: '7px 0px' }}>
                {new Date(email.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Typography>
            </Box>
          ))}
        </Box>
      </Drawer>
    </>
  )
}

export default SidebarLeft


