
import { useState } from 'react'

import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MuiMenu from '@mui/material/Menu'
import MuiMenuItem from '@mui/material/MenuItem'

import Icon from 'src/@core/components/icon'

const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    border: `1px solid ${theme.palette.divider}`
  }
}))

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  '&:focus': {
    backgroundColor: theme.palette.primary.main,
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: theme.palette.common.white
    }
  }
}))

const MenuCustomized = () => {

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button variant='outlined' aria-haspopup='true' onClick={handleClick} aria-controls='customized-menu'>
        Open Menu
      </Button>
      <Menu
        keepMounted
        elevation={0}
        anchorEl={anchorEl}
        id='customized-menu'
        onClose={handleClose}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <Icon icon='mdi:send' fontSize={20} />
          </ListItemIcon>
          <ListItemText primary='Sent mail' />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Icon icon='mdi:email-open' fontSize={20} />
          </ListItemIcon>
          <ListItemText primary='Drafts' />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Icon icon='mdi:inbox-arrow-down' fontSize={20} />
          </ListItemIcon>
          <ListItemText primary='Inbox' />
        </MenuItem>
      </Menu>
    </div>
  )
}

export default MenuCustomized
