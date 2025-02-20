import { styled } from '@mui/material/styles'
import MuiSwipeableDrawer from '@mui/material/SwipeableDrawer'

const SwipeableDrawer = styled(MuiSwipeableDrawer)({
  overflowX: 'hidden',
  transition: 'width .25s ease-in-out',
  '& ul': {
    listStyle: 'none'
  },
  '& .MuiListItem-gutters': {
    paddingLeft: 4,
    paddingRight: 4
  },
  '& .MuiDrawer-paper': {
    left: 'unset',
    right: 'unset',
    overflowX: 'hidden',
    transition: 'width .25s ease-in-out, box-shadow .25s ease-in-out'
  }
})

const Drawer = props => {
  const {
    hidden,
    children,
    navHover,
    navWidth,
    settings,
    navVisible,
    setNavHover,
    navMenuProps,
    setNavVisible,
    collapsedNavWidth,
    navigationBorderWidth
  } = props

  const { navCollapsed } = settings
  let flag = true

  const MobileDrawerProps = {
    open: navVisible,
    onOpen: () => setNavVisible(true),
    onClose: () => setNavVisible(false),
    ModalProps: {
      keepMounted: true
    }
  }

  const DesktopDrawerProps = {
    open: true,
    onOpen: () => null,
    onClose: () => null,
    onMouseEnter: () => {
      if (flag || navCollapsed) {
        setNavHover(true)
        flag = false
      }
    },
    onMouseLeave: () => {
      if (navCollapsed) {
        setNavHover(false)
      }
    }
  }
  let userNavMenuStyle = {}
  let userNavMenuPaperStyle = {}
  if (navMenuProps && navMenuProps.sx) {
    userNavMenuStyle = navMenuProps.sx
  }
  if (navMenuProps && navMenuProps.PaperProps && navMenuProps.PaperProps.sx) {
    userNavMenuPaperStyle = navMenuProps.PaperProps.sx
  }
  const userNavMenuProps = Object.assign({}, navMenuProps)
  delete userNavMenuProps.sx
  delete userNavMenuProps.PaperProps

  return (
    <SwipeableDrawer
      className='layout-vertical-nav'
      variant={hidden ? 'temporary' : 'permanent'}
      {...(hidden ? { ...MobileDrawerProps } : { ...DesktopDrawerProps })}
      PaperProps={{
        sx: {
          backgroundColor: 'background.default',
          width: navCollapsed && !navHover ? collapsedNavWidth : navWidth,
          ...(!hidden && navCollapsed && navHover ? { boxShadow: 10 } : {}),
          borderRight: theme =>
            navigationBorderWidth === 0 ? 0 : `${navigationBorderWidth}px solid ${theme.palette.divider}`,
          ...userNavMenuPaperStyle
        },
        ...navMenuProps?.PaperProps
      }}
      sx={{
        width: navCollapsed ? collapsedNavWidth : navWidth,
        ...userNavMenuStyle
      }}
      {...userNavMenuProps}
    >
      {children}
    </SwipeableDrawer>
  )
}

export default Drawer