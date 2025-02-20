import { useState } from "react";
import { getInitials } from "./get-initials";
import CustomAvatar from 'src/@core/components/mui/avatar'


export const renderClient = row => {

const Name=row.username || 'A'
  const initials = getInitials(Name);
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const [fixedColor] = useState(() => {
    return states[Math.floor(Math.random() * states.length)]
  })

  if (row.profileImage) {
    return (
      <CustomAvatar src={row.profileImage} sx={{ mr: 3, width: '3rem', height: '3rem', borderRadius: '8px'}} />
    )
  } else {
    return (
      <CustomAvatar  skin='light' color={fixedColor} sx={{mr: 3,fontSize: '.8rem',width: '3rem',height: '3rem',borderRadius: '8px'}}>
        {initials}
      </CustomAvatar>
    )
  }
}

