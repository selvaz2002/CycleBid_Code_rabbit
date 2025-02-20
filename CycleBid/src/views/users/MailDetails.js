import { Fragment, useState } from 'react'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ListItemIcon from '@mui/material/ListItemIcon'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import OptionsMenu from 'src/@core/components/option-menu'
import DefaultMail from 'src/views/users/DefaultMail'
import SmallMail from 'src/views/users/SmallMail'

const HiddenReplyBack = styled(Box)(({ theme }) => ({
  height: 11,
  width: '90%',
  opacity: 0.5,
  borderWidth: 1,
  borderBottom: 0,
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderStyle: 'solid',
  borderColor: theme.palette.divider,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper
}))

const HiddenReplyFront = styled(Box)(({ theme }) => ({
  height: 12,
  width: '95%',
  opacity: 0.7,
  borderWidth: 1,
  borderBottom: 0,
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderStyle: 'solid',
  borderColor: theme.palette.divider,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper
}))

const MailDetails = props => {
  const {
    dispatch,
    direction,
    paginateMail,
    email,
    isComposeOpen,
    toggleCompose,
  } = props

  const [showReplies, setShowReplies] = useState(false)

  const theme = useTheme()
  const { settings } = useSettings()

  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const prevMailIcon = direction === 'rtl' ? 'mdi:chevron-right' : 'mdi:chevron-left'
  const nextMailIcon = direction === 'rtl' ? 'mdi:chevron-left' : 'mdi:chevron-right'
  const goBackIcon = prevMailIcon

  if (isComposeOpen)
    return (
      <Box
      sx={{
        height: 'calc(100vh)',
        overflowY: 'auto', 
        overflowX: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
      }}
        >
      <DefaultMail
        mdAbove={mdAbove}
      />
      </Box>
    )
  else {
    return (
      <Box
      sx={{
        height: 'calc(100vh)',
        overflowY: 'auto', 
        overflowX: 'hidden',
        display: 'flex', 
        flexDirection: 'column',
      }}
        >
        {email ? (
          <Fragment>
            <Box
              sx={{
                px: 2.6,
                py: [2.25, 3],
                backgroundColor: 'background.paper',
                borderBottom: theme => `1px solid ${theme.palette.divider}`
              }}
            >
              <Box sx={{ display: 'flex', alignItems: ['flex-start', 'center'], justifyContent: 'space-between' }}>
                <Box
                  sx={{
                    display: 'flex',
                    overflow: 'hidden',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <IconButton sx={{ mr: 3, '& svg': { color: 'text.primary' } }} onClick={toggleCompose}>
                    <Icon icon={goBackIcon} fontSize='1.5rem' />
                  </IconButton>
                  <Box
                    sx={{
                      display: 'flex',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      flexDirection: ['column', 'row']
                    }}
                  >
                    <Typography noWrap sx={{ mr: 5 }}>
                      {email.subject}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                     
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <IconButton
                    size='small'
                    disabled={!email.hasPreviousMail}
                    sx={{ color: email.hasPreviousMail ? 'text.primary' : 'text.secondary' }}
                    onClick={() => dispatch(paginateMail({ dir: 'previous', emailId: email.id }))}
                  >
                    <Icon icon={prevMailIcon} />
                  </IconButton>
                  <IconButton
                    size='small'
                    disabled={!email.hasNextMail}
                    sx={{ color: email.hasNextMail ? 'text.primary' : 'text.secondary' }}
                    onClick={() => dispatch(paginateMail({ dir: 'next', emailId: email.id }))}
                  >
                    <Icon icon={nextMailIcon} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                backgroundColor: 'background.paper',
                p: theme => theme.spacing(3, 2, 3, 3),
                borderBottom: theme => `1px solid ${theme.palette.divider}`
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    size='small'
                    sx={{ padding: '0 10px' }}
                  >
                    <Icon icon='ri:delete-bin-7-line' color='#262B43B2' />
                  </IconButton>

                  <IconButton
                    size='small'
                    sx={{ padding: '0 10px' }}
                  >
                    <Icon icon='mdi:email-outline' color='#262B43B2' />
                  </IconButton>
                  <IconButton
                    size='small'
                    sx={{ padding: '0 10px' }}
                  >
                    <Icon icon='mdi:folder-outline' color='#262B43B2' />
                  </IconButton>
                  <IconButton
                    size='small'
                    sx={{ padding: '0 10px' }}
                  >
                    <Icon icon='ri:price-tag-3-line' color='#262B43B2' />
                  </IconButton>
                </Box>
                <div>
                  <IconButton
                    size='small'
                  >
                    <Icon icon='mdi:star-outline' />
                  </IconButton>
                  {email.replies.length ? (
                    <IconButton
                      size='small'
                      onClick={() => (showReplies ? setShowReplies(false) : setShowReplies(true))}
                    >
                      {showReplies ? (
                        <Icon icon='mdi:arrow-collapse-vertical' fontSize='1.375rem' />
                      ) : (
                        <Icon icon='mdi:arrow-expand-vertical' fontSize='1.375rem' />
                      )}
                    </IconButton>
                  ) : null}
                  <IconButton size='small'>
                    <Icon icon='mdi:dots-vertical' />
                  </IconButton>
                </div>
              </Box>
            </Box>
            <Box sx={{ height: 'calc(100% - 7.75rem)', backgroundColor: 'action.hover',zIndex:9 }}>
              <Box
                sx={{
                  py: 4,
                  px: 5,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  overflowY: "auto"
                }}
              >
                {email.replies.length && !showReplies ? (
                  <Fragment>
                    <HiddenReplyBack sx={{ cursor: 'pointer' }} onClick={() => setShowReplies(true)} />
                    <HiddenReplyFront sx={{ cursor: 'pointer' }} onClick={() => setShowReplies(true)} />
                  </Fragment>
                ) : null}

                <Box
                  sx={{
                    mb: 4,
                    width: '100%',
                    borderRadius: 1,
                    overflow: 'visible',
                    position: 'relative',
                    backgroundColor: 'background.paper',
                    boxShadow: settings.skin === 'bordered' ? 0 : 6,
                    border: theme => `1px solid ${theme.palette.divider}`,
                    overflowY: "auto",
                    flexGrow: 1,

                  }}
                >
                  <Box sx={{ p: 5 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        overflow: "hidden",
                        [theme.breakpoints.down('sm')]: {
                          flexDirection: 'column', 
                          alignItems: 'flex-start',
                        },
                      }}
                    >
                      <Box sx={{  display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                gap: 2,
                                width: '100%',
                        [theme.breakpoints.up('sm')]: {
                        width: 'auto', 
                           }, }}>
                        <Avatar
                          alt={email.from.name}
                          src={email.from.avatar}
                          sx={{ width: '2.375rem', height: '2.375rem', mr: 3 }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ color: 'text.secondary' }}>{email.from.name}</Typography>
                          <Typography variant='body2' sx={{ color: 'text.disabled',width:"auto"}}>
                            {email.from.email}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' ,mt:{xs:2.5}}}>
                        <Typography variant='body2' sx={{ mr: 1.75, color: 'text.disabled' }}>
                          {new Date(email.time).toDateString()}{' '}
                          {new Date(email.time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </Typography>
                        {email.attachments.length ? (
                          <IconButton size='small' sx={{ mr: 0.5, color: 'action.active' }}>
                            <Icon icon='mdi:attachment' fontSize={20} />
                          </IconButton>
                        ) : null}
                        <OptionsMenu
                          iconButtonProps={{ size: 'small' }}
                          iconProps={{ fontSize: '1.375rem' }}
                          options={[
                            {
                              text: 'Reply',
                              menuItemProps: { sx: { '& svg': { mr: 2 } } },
                              icon: <Icon icon='mdi:share-outline' fontSize={20} />
                            },
                            {
                              text: 'Forward',
                              menuItemProps: { sx: { '& svg': { mr: 2 } } },
                              icon: <Icon icon='mdi:reply-outline' fontSize={20} />
                            }
                          ]}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Divider sx={{ m: '0 !important' }} />
                  <Box sx={{ px: 5, py: 0 }}>
                    <Box sx={{ color: 'text.secondary' }} dangerouslySetInnerHTML={{ __html: email.message }} />
                  </Box>
                  {email.attachments.length ? (
                    <Fragment>
                      <Divider sx={{ m: '0 !important' }} />
                      <Box sx={{ p: 5 }}>
                        <Typography variant='body2'>Attachments</Typography>
                        <List>
                          {email.attachments.map(item => {
                            return (
                              <ListItem disableGutters key={item.fileName}>
                                <ListItemIcon>
                                  <img src={item.thumbnail} alt={item.fileName} width='24' height='24' />
                                </ListItemIcon>
                                <Typography>{item.fileName}</Typography>
                              </ListItem>
                            )
                          })}
                        </List>
                      </Box>
                    </Fragment>
                  ) : null}
                </Box>

                <SmallMail mdAbove={mdAbove} />
              </Box>
            </Box>
          </Fragment>
        ) : null}
      </Box>
    )
  }
}

export default MailDetails