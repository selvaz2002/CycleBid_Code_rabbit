import { useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'
import clsx from 'clsx'
import Icon from 'src/@core/components/icon'
import themeConfig from 'src/configs/themeConfig'
import { hasActiveChild, removeChildren } from 'src/@core/layouts/utils'
import VerticalNavItems from './VerticalNavItems'
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavGroup from 'src/layouts/components/acl/CanViewNavGroup'

const MenuItemTextWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
}))

const VerticalNavGroup = props => {
  const {
    item,
    parent,
    settings,
    navHover,
    navVisible,
    isSubToSub,
    groupActive,
    setGroupActive,
    collapsedNavWidth,
    currentActiveGroup,
    setCurrentActiveGroup,
    navigationBorderWidth
  } = props

  const router = useRouter()
  const currentURL = router.asPath
  const { direction, navCollapsed, verticalNavToggleType } = settings

  const toggleActiveGroup = (item, parent) => {
    let openGroup = groupActive

    if (openGroup.includes(item.title)) {
      openGroup.splice(openGroup.indexOf(item.title), 1)

      if (item.children) {
        removeChildren(item.children, openGroup, currentActiveGroup)
      }
    } else if (parent) {
      if (parent.children) {
        removeChildren(parent.children, openGroup, currentActiveGroup)
      }

      if (!openGroup.includes(item.title)) {
        openGroup.push(item.title)
      }
    } else {
      openGroup = []

      if (currentActiveGroup.every(elem => groupActive.includes(elem))) {
        openGroup.push(...currentActiveGroup)
      }

      if (!openGroup.includes(item.title)) {
        openGroup.push(item.title)
      }
    }
    setGroupActive([...openGroup])
  }

  const handleGroupClick = () => {
    const openGroup = groupActive
    if (verticalNavToggleType === 'collapse') {
      if (openGroup.includes(item.title)) {
        openGroup.splice(openGroup.indexOf(item.title), 1)
      } else {
        openGroup.push(item.title)
      }
      setGroupActive([...openGroup])
    } else {
      toggleActiveGroup(item, parent)
    }
  }
  useEffect(() => {
    if (hasActiveChild(item, currentURL)) {
      if (!groupActive.includes(item.title)) groupActive.push(item.title)
    } else {
      const index = groupActive.indexOf(item.title)
      if (index > -1) groupActive.splice(index, 1)
    }
    setGroupActive([...groupActive])
    setCurrentActiveGroup([...groupActive])

    if (navCollapsed && !navHover) {
      setGroupActive([])
    }
  }, [router.asPath])
  useEffect(() => {
    if (navCollapsed && !navHover) {
      setGroupActive([])
    }
    if ((navCollapsed && navHover) || (groupActive.length === 0 && !navCollapsed)) {
      setGroupActive([...currentActiveGroup])
    }
  }, [navCollapsed, navHover])
  useEffect(() => {
    if (groupActive.length === 0 && !navCollapsed) {
      setGroupActive([])
    }
  }, [navHover])
  const icon = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon
  const menuGroupCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  return (
    <CanViewNavGroup navGroup={item}>
      <Fragment>
        <ListItem
          disablePadding
          className='nav-group'
          onClick={handleGroupClick}
          sx={{
            mt: 1.5,
            flexDirection: 'column',
            transition: 'padding .25s ease-in-out',
            px: theme =>
              parent && item.children
                ? '0 !important'
                : `${theme.spacing(navCollapsed && !navHover ? 2 : 3)} !important`
          }}
        >
          <ListItemButton
            className={clsx({
              'Mui-selected': groupActive.includes(item.title) || currentActiveGroup.includes(item.title)
            })}
            sx={{
              py: 2.25,
              width: '100%',
              borderRadius: '8px',
              transition: 'padding-left .25s ease-in-out',
              pr: navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 24 - 16) / 8 : 3,
              pl: navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 24 - 16) / 8 : 4,
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.selected'
                }
              },
              '&.Mui-selected.Mui-focusVisible': {
                backgroundColor: 'action.focus',
                '&:hover': {
                  backgroundColor: 'action.focus'
                }
              }
            }}
          >
            {isSubToSub ? null : (
              <ListItemIcon
                sx={{
                  transition: 'margin .25s ease-in-out',
                  ...(parent && navCollapsed && !navHover ? {} : { mr: 2 }),
                  ...(navCollapsed && !navHover ? { mr: 0 } : {}),
                  ...(parent && item.children ? { ml: 2, mr: 4 } : {}),
                  color: parent && item.children ? 'text.secondary' : 'text.primary'
                }}
              >
                <UserIcon icon={icon} {...(parent && { fontSize: '0.5rem' })} />
              </ListItemIcon>
            )}
            <MenuItemTextWrapper sx={{ ...menuGroupCollapsedStyles, ...(isSubToSub ? { ml: 8 } : {}) }}>
              <Typography
                {...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                  noWrap: true
                })}
              >
                <Translations text={item.title} />
              </Typography>
              <Box
                className='menu-item-meta'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '& svg': {
                    transition: 'transform .25s ease-in-out',
                    ...(groupActive.includes(item.title) && {
                      transform: direction === 'ltr' ? 'rotate(90deg)' : 'rotate(-90deg)'
                    })
                  }
                }}
              >
                {item.badgeContent ? (
                  <Chip
                    size='small'
                    label={item.badgeContent}
                    color={item.badgeColor || 'primary'}
                    sx={{ mr: 1.5, '& .MuiChip-label': { px: 2.5, lineHeight: 1.385, textTransform: 'capitalize' } }}
                  />
                ) : null}
                <Icon icon={direction === 'ltr' ? 'mdi:chevron-right' : 'mdi:chevron-left'} />
              </Box>
            </MenuItemTextWrapper>
          </ListItemButton>
          <Collapse
            component='ul'
            onClick={e => e.stopPropagation()}
            in={groupActive.includes(item.title)}
            sx={{
              pl: 0,
              width: '100%',
              ...menuGroupCollapsedStyles,
              transition: 'all 0.25s ease-in-out'
            }}
          >
            <VerticalNavItems
              {...props}
              parent={item}
              navVisible={navVisible}
              verticalNavItems={item.children}
              isSubToSub={parent && item.children ? item : undefined}
            />
          </Collapse>
        </ListItem>
      </Fragment>
    </CanViewNavGroup>
  )
}

export default VerticalNavGroup