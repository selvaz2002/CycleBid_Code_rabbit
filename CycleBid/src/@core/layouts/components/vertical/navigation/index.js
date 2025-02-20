import { useRef, useState } from 'react'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import { createTheme, responsiveFontSizes, styled, ThemeProvider } from '@mui/material/styles'
import PerfectScrollbar from 'react-perfect-scrollbar'
import themeConfig from 'src/configs/themeConfig'
import Drawer from './Drawer'
import VerticalNavItems from './VerticalNavItems'
import VerticalNavHeader from './VerticalNavHeader'
import themeOptions from 'src/@core/theme/ThemeOptions'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const StyledBoxForShadow = styled(Box)(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  height: theme.mixins.toolbar.minHeight,
  transition: 'opacity .15s ease-in-out',
  background: `linear-gradient(${theme.palette.background.default} ${
    theme.direction === 'rtl' ? '95%' : '5%'
  },${hexToRGBA(theme.palette.background.default, 0.85)} 30%,${hexToRGBA(
    theme.palette.background.default,
    0.5
  )} 65%,${hexToRGBA(theme.palette.background.default, 0.3)} 75%,transparent)`,
  '&.scrolled': {
    opacity: 1
  }
}))

const Navigation = props => {
  const { hidden, settings, afterNavMenuContent, beforeNavMenuContent, navMenuContent: userNavMenuContent } = props

  const [navHover, setNavHover] = useState(false)
  const [groupActive, setGroupActive] = useState([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState([])

  const shadowRef = useRef(null)

  const { afterVerticalNavMenuContentPosition, beforeVerticalNavMenuContentPosition } = themeConfig

  const navMenuContentProps = {
    ...props,
    navHover,
    groupActive,
    setGroupActive,
    currentActiveGroup,
    setCurrentActiveGroup
  }

  let darkTheme = createTheme(themeOptions(settings, 'dark'))

  if (themeConfig.responsiveFontSizes) {
    darkTheme = responsiveFontSizes(darkTheme)
  }

  const handleInfiniteScroll = ref => {
    if (ref) {
      ref._getBoundingClientRect = ref.getBoundingClientRect
      ref.getBoundingClientRect = () => {
        const original = ref._getBoundingClientRect()

        return { ...original, height: Math.floor(original.height) }
      }
    }
  }

  const scrollMenu = container => {
    if (beforeVerticalNavMenuContentPosition === 'static' || !beforeNavMenuContent) {
      container = hidden ? container.target : container
      if (shadowRef && container.scrollTop > 0) {
        if (!shadowRef.current.classList.contains('scrolled')) {
          shadowRef.current.classList.add('scrolled')
        }
      } else {
        shadowRef.current.classList.remove('scrolled')
      }
    }
  }
  const ScrollWrapper = hidden ? Box : PerfectScrollbar

  return (
    <ThemeProvider theme={darkTheme}>
      <Drawer {...props} navHover={navHover} setNavHover={setNavHover}>
        <VerticalNavHeader {...props} navHover={navHover} />
        {beforeNavMenuContent && beforeVerticalNavMenuContentPosition === 'fixed'
          ? beforeNavMenuContent(navMenuContentProps)
          : null}
        {(beforeVerticalNavMenuContentPosition === 'static' || !beforeNavMenuContent) && (
          <StyledBoxForShadow ref={shadowRef} />
        )}
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <ScrollWrapper
            {...(hidden
              ? {
                  onScroll: container => scrollMenu(container),
                  sx: { height: '100%', overflowY: 'auto', overflowX: 'hidden' }
                }
              : {
                  options: { wheelPropagation: false },
                  onScrollY: container => scrollMenu(container),
                  containerRef: ref => handleInfiniteScroll(ref)
                })}
          >
            {beforeNavMenuContent && beforeVerticalNavMenuContentPosition === 'static'
              ? beforeNavMenuContent(navMenuContentProps)
              : null}
            {userNavMenuContent ? (
              userNavMenuContent(navMenuContentProps)
            ) : (
              <List className='nav-items' sx={{ pt: 0, '& > :first-child': { mt: '0' } }}>
                <VerticalNavItems
                  navHover={navHover}
                  groupActive={groupActive}
                  setGroupActive={setGroupActive}
                  currentActiveGroup={currentActiveGroup}
                  setCurrentActiveGroup={setCurrentActiveGroup}
                  {...props}
                />
              </List>
            )}
            {afterNavMenuContent && afterVerticalNavMenuContentPosition === 'static'
              ? afterNavMenuContent(navMenuContentProps)
              : null}
          </ScrollWrapper>
        </Box>
        {afterNavMenuContent && afterVerticalNavMenuContentPosition === 'fixed'
          ? afterNavMenuContent(navMenuContentProps)
          : null}
      </Drawer>
    </ThemeProvider>
  )
}

export default Navigation