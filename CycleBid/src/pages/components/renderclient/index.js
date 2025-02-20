import React from 'react'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'

const RenderClient = ({ row }) => {
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[Math.floor(Math.random() * states.length)]
  return row?.avatar ? (
    <CustomAvatar src={row.avatar} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  ) : (
    <CustomAvatar skin='light' color={color} sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}>
      {getInitials(row?.full_name || 'A')}
    </CustomAvatar>
  )
}
export default RenderClient

