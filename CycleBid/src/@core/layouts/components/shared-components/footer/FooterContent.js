import Link from 'next/link'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FooterContent = () => {

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`Copyright ${new Date().getFullYear()}  `}
        
        <LinkStyled target='_blank' href='#'>
        Cyclebids
        </LinkStyled>
      </Typography>
    </Box>
  )
}

export default FooterContent