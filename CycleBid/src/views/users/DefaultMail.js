import { useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import ButtonGroup from '@mui/material/ButtonGroup'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import Icon from 'src/@core/components/icon'
import { EditorState, RichUtils } from 'draft-js'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import { getInitials } from 'src/@core/utils/get-initials'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const menuItemsArr = [
  {
    name: 'Ross Geller',
    value: 'ross',
    src: '/images/avatars/1.png'
  },
  {
    name: 'Pheobe Buffay',
    value: 'pheobe',
    src: '/images/avatars/2.png'
  },
  {
    name: 'Joey Tribbiani',
    value: 'joey',
    src: '/images/avatars/3.png'
  },
  {
    name: 'Rachel Green',
    value: 'rachel',
    src: '/images/avatars/4.png'
  },
  {
    name: 'Chandler Bing',
    value: 'chandler',
    src: '/images/avatars/5.png'
  },
  {
    name: 'Monica Geller',
    value: 'monica',
    src: '/images/avatars/8.png'
  }
]
const filter = createFilterOptions()

const CustomToolbar = ({ onToggle, onToggleAlignment, onToggleList, currentStyle, currentBlockType }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: { xs: "1px !important", md: "10px" }, margin: '10px', marginBottom: "5px", flexWrap: "wrap" }}>
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onToggle('BOLD');
      }}
      style={{
        marginRight: currentStyle.has('BOLD') ? '5px' : '0px',
        backgroundColor: currentStyle.has('BOLD') ? '#ccc' : 'transparent',
        border: 'none',
        padding: '5px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      <Icon icon="heroicons:bold-solid" width="24" height="24" />
    </button>

    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onToggle('ITALIC');
      }}
      style={{
        marginRight: currentStyle.has('ITALIC') ? '5px' : '0px',
        backgroundColor: currentStyle.has('ITALIC') ? '#ccc' : 'transparent',
        border: 'none',
        padding: '5px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      <Icon icon="tabler:italic" width="24" height="24" />
    </button>

    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onToggle('UNDERLINE');
      }}
      style={{
        marginRight: currentStyle.has('UNDERLINE') ? '5px' : '0px',
        backgroundColor: currentStyle.has('UNDERLINE') ? '#ccc' : 'transparent',
        border: 'none',
        padding: '5px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      <Icon icon="mingcute:underline-line" width="24" height="24" />
    </button>

    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onToggle('LETTER_SPACING');
      }}
      style={{
        marginRight: currentStyle.has('LETTER_SPACING') ? '5px' : '0px',
        backgroundColor: currentStyle.has('LETTER_SPACING') ? '#ccc' : 'transparent',
        border: 'none',
        padding: '5px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      <Icon icon="ri:text-spacing" width="24" height="24" />
    </button>

    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onToggleList('unordered-list-item');
      }}
      style={{
        backgroundColor: currentBlockType === 'unordered-list-item' ? '#ccc' : 'transparent',
        border: 'none',
        padding: '5px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      <Icon icon="ri:list-unordered" width="24" height="24" />
    </button>

    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onToggleAlignment('LEFT');
      }}
      style={{
        backgroundColor: currentBlockType === 'left' ? '#ccc' : 'transparent',
        border: 'none',
        padding: '5px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      <Icon icon="line-md:align-left" width="24" height="24" />
    </button>

    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onToggleAlignment('CENTER');
      }}
      style={{
        backgroundColor: currentBlockType === 'center' ? '#ccc' : 'transparent',
        border: 'none',
        padding: '5px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      <Icon icon="line-md:align-center" width="24" height="24" />
    </button>

    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onToggleAlignment('RIGHT');
      }}
      style={{
        backgroundColor: currentBlockType === 'right' ? '#ccc' : 'transparent',
        border: 'none',
        padding: '5px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      <Icon icon="line-md:align-right" width="24" height="24" />
    </button>

    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onToggleAlignment('JUSTIFY');
      }}
      style={{
        backgroundColor: currentBlockType === 'justify' ? '#ccc' : 'transparent',
        border: 'none',
        padding: '5px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      <Icon icon="mingcute:align-justify-line" width="24" height="24" />
    </button>
  </div>
);

const ComposePopup = props => {
  const { mdAbove, composeOpen, composePopupWidth, toggleComposeOpen, toMailId } = props

  const [emailTo, setEmailTo] = useState(toMailId ? [{ name: toMailId }] : [])
  const [ccValue, setccValue] = useState([])
  const [subjectValue, setSubjectValue] = useState('')
  const [bccValue, setbccValue] = useState([])
  const [sendBtnOpen, setSendBtnOpen] = useState(false)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const currentStyle = editorState.getCurrentInlineStyle()
  const selection = editorState.getSelection();
  const currentContent = editorState.getCurrentContent();
  const currentBlock = currentContent.getBlockForKey(selection.getAnchorKey());
  const currentBlockType = currentBlock.getType();

  const customStyleMap = {
    BOLD: { fontWeight: 'bold' },
    ITALIC: { fontStyle: 'italic' },
    UNDERLINE: { textDecoration: 'underline' },
    LETTER_SPACING: { letterSpacing: '2px' },
    LEFT: { textAlign: 'left' },
    RIGHT: { textAlign: '2rightpx' },
    CENTER: { textAlign: 'center' },
    JUSTIFY: { textAlign: 'justify' }
  }

  const handleToggleInlineStyle = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  }

  const handleToggleList = (alignment) => {
    setEditorState(RichUtils.toggleBlockType(editorState, alignment))
  }

  const handleToggleTextAlignment = (alignment) => {
    let blockType
    switch (alignment) {
      case 'LEFT':
        blockType = 'left'
        break
      case 'CENTER':
        blockType = 'center'
        break
      case 'RIGHT':
        blockType = 'right'
        break
      case 'JUSTIFY':
        blockType = 'justify'
        break
      default:
        return
    }
    setEditorState(RichUtils.toggleBlockType(editorState, blockType))
  }

  const blockStyleFn = contentBlock => {

    const type = contentBlock.getType()
    switch (type) {
      case 'left':
        return 'align-left'
      case 'center':
        return 'align-center'
      case 'right':
        return 'align-right'
      case 'justify':
        return 'align-justify'
      default:
        return ''
    }
  }

  const [visibility, setVisibility] = useState({
    cc: false,
    bcc: false
  })

  const anchorRefSendBtn = useRef(null)
  const toggleVisibility = value => setVisibility({ ...visibility, [value]: !visibility[value] })

  const handleMailDelete = (value, state, setState) => {
    const arr = state
    const index = arr.findIndex(i => i.value === value)
    arr.splice(index, 1)
    setState([...arr])
  }

  const handlePopupClose = () => {
    setEmailTo([])
    setccValue([])
    setbccValue([])
    setSubjectValue('')
    setEditorState(EditorState.createEmpty())
    setVisibility({
      cc: false,
      bcc: false
    })
  }

  const handleMinimize = () => {

    setEmailTo(emailTo)
    setccValue(ccValue)
    setbccValue(bccValue)
    setVisibility(visibility)
    setEditorState(editorState)
    setSubjectValue(subjectValue)
  }

  const renderCustomChips = (array, getTagProps, state, setState) => {
    return array.map((item, index) => (
      <Chip
        size='small'
        key={item.value}
        label={item.name}
        {...getTagProps({ index })}
        deleteIcon={<Icon icon='mdi:close' />}
        onDelete={() => handleMailDelete(item.value, state, setState)}
      />
    ))
  }

  const renderListItem = (props, option, array, setState) => {
    return (
      <ListItem key={option.value} sx={{ cursor: 'pointer' }} onClick={() => setState([...array, option])}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {option.src.length ? (
            <CustomAvatar src={option.src} alt={option.name} sx={{ mr: 3, width: 22, height: 22 }} />
          ) : (
            <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 22, height: 22, fontSize: '.75rem' }}>
              {getInitials(option.name)}
            </CustomAvatar>
          )}
          <Typography sx={{ fontSize: '0.875rem' }}>{option.name}</Typography>
        </Box>
      </ListItem>
    )
  }

  const addNewOption = (options, params) => {
    const filtered = filter(options, params)
    const { inputValue } = params
    const isExisting = options.some(option => inputValue === option.name)
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        name: inputValue,
        value: inputValue,
        src: ''
      })
    }
    return filtered
  }

  return (
    <Drawer
      hideBackdrop
      anchor='bottom'
      open={composeOpen}
      variant='permanent'
      onClose={toggleComposeOpen}
      sx={{
        display: 'flex',
        height: "auto",

        '& .MuiDrawer-paper': {
          borderRadius: 1,
          border: '1px solid #bdbdbd',
          position: 'static',
          width: { xs: '200px', md: '550px', lg: '90%' },
          height: 'auto',
          margin: '20px',
          overflowX: "auto",
          zIndex: 5
        }
      }}
    >
      <Box
        sx={{
          px: 4,
          py: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
        }}
      >
        <Typography sx={{ fontWeight: 400, color: 'text.secondary', fontSize: '20px', color: '#262B43' }}>
          Compose Mail
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ p: 1, mr: 2, color: 'action.active' }} onClick={handleMinimize}>
            <Icon icon='mdi:minus' fontSize={20} />
          </IconButton>
          <IconButton sx={{ p: 1, color: 'action.active' }} onClick={handlePopupClose}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          px: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <div>
            <InputLabel sx={{ mr: 3, color: 'text.disabled', p: 2 }} htmlFor='email-to-select'>
              To:
            </InputLabel>
          </div>
          <Autocomplete
            multiple
            freeSolo
            value={emailTo}
            clearIcon={false}
            id='email-to-select'
            filterSelectedOptions
            options={menuItemsArr}
            ListboxComponent={List}
            filterOptions={addNewOption}
            getOptionLabel={option => option.name}
            renderOption={(props, option) => renderListItem(props, option, emailTo, setEmailTo)}
            renderTags={(array, getTagProps) => renderCustomChips(array, getTagProps, emailTo, setEmailTo)}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': { p: 2 },
              '& .MuiAutocomplete-endAdornment': { display: 'none' }
            }}
            renderInput={params => (
              <TextField
                {...params}
                autoComplete='new-password'
                sx={{
                  border: 0,
                  '& fieldset': { border: '0 !important' },
                  '& .MuiOutlinedInput-root': { p: '0 !important' }
                }}
              />
            )}
          />
        </Box>
        <Typography sx={{ color: 'text.secondary', display: { xs: "flex", md: "inline" }, flexWrap: { xs: "wrap", md: "normal" }, flexDirection: { xs: "row", md: "row" } }}>
          <Box component='span' sx={{ cursor: 'pointer', color: 'grey' }} onClick={() => toggleVisibility('cc')}>
            Cc
          </Box>
          <Box component='span' sx={{ mx: 2, color: 'grey', display: { xs: "none", md: "inline" } }}>
            |
          </Box>
          <Box component='span' sx={{ cursor: 'pointer', color: 'grey' }} onClick={() => toggleVisibility('bcc')}>
            Bcc
          </Box>
        </Typography>
      </Box>
      {visibility.cc ? (
        <Box
          sx={{
            py: 1,
            px: 4,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <div>
            <InputLabel sx={{ mr: 3, color: 'text.disabled' }} htmlFor='email-cc-select'>
              Cc:
            </InputLabel>
          </div>
          <TextField
            fullWidth
            size='small'
            sx={{
              border: 0,
              '& fieldset': { border: '0 !important' },
              '& .MuiOutlinedInput-root': { p: '0 !important' }
            }}
          />
        </Box>
      ) : null}
      {visibility.bcc ? (
        <Box
          sx={{
            py: 1,
            px: 4,
            display: 'flex',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <div>
            <InputLabel sx={{ mr: 3, color: 'text.disabled' }} htmlFor='email-bcc-select'>
              Bcc:
            </InputLabel>
          </div>
          <TextField
            fullWidth
            size='small'
            sx={{
              border: 0,
              '& fieldset': { border: '0 !important' },
              '& .MuiOutlinedInput-root': { p: '0 !important' }
            }}
          />
        </Box>
      ) : null}
      <Box
        sx={{
          px: 4,
          display: 'flex',
          alignItems: 'center',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <div>
          <InputLabel sx={{ mr: 3, color: 'text.disabled' }} htmlFor='email-subject-input'>
            Subject:
          </InputLabel>
        </div>
        <Input
          fullWidth
          value={subjectValue}
          id='email-subject-input'
          onChange={e => setSubjectValue(e.target.value)}
          sx={{ '&:before, &:after': { display: 'none' }, '& .MuiInput-input': { py: 1.875 } }}
        />
      </Box>

      <CustomToolbar onToggle={handleToggleInlineStyle}
        currentStyle={currentStyle}
        currentBlockType={currentBlockType}
        onToggleList={handleToggleList}
        onToggleAlignment={handleToggleTextAlignment} />


      <div
        style={{
          borderTop: '1px solid #eeeeee',
          borderBottom: '1px solid #eeeeee',
          borderRadius: '4px',
          padding: '8px',
          minHeight: { xs: 'auto', sm: "300px", md: '200px', lg: '300px' }
        }}
        onClick={() => document.getElementById('editor').focus()}
      >
        <EditorWrapper
          id='editor'
          sx={{
            '& .rdw-editor-wrapper': {
              border: '0 !important'
            },
            '& .rdw-editor-toolbar': {
              p: '0.35rem 1rem !important',
              '& .rdw-option-wrapper': {
                minWidth: '1.25rem',
                borderRadius: '5px !important',
                border: 'none'
              },
              '& .rdw-inline-wrapper, & .rdw-text-align-wrapper': {
                mb: 0
              }
            },
            '& .rdw-editor-main': {
              px: '1.25rem',
              minHeight: { xs: 'auto', lg: '29.67rem !important' }
            }
          }}
        >
          <ReactDraftWysiwyg

            editorState={editorState}
            onEditorStateChange={editorState => setEditorState(editorState)}
            placeholder='Message'
            blockStyleFn={blockStyleFn}
            customStyleMap={customStyleMap}
            toolbar={{
              options: ['inline', 'list', 'textAlign'],
              inline: {
                inDropdown: false,
                options: [
                ]
              },
              list: {
                inDropdown: false,
                options: [
                ]
              },
              textAlign: {
                inDropdown: false,
                options: ['left', 'center', 'right', 'justify']
              }
            }}
            toolbarStyle={{
              padding: '0px !important',
              backgroundColor: 'transparent',
              boxShadow: 'none'
            }}
          />
        </EditorWrapper>
      </div>
      <Box
        sx={{
          px: 1,
          py: 3,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          borderTop: theme => `1px solid ${theme.palette.divider}`,
          flexWrap: "wrap",
          flexDirection: "row"

        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', pb: "4px" }}>
          <IconButton size='small' onClick={handlePopupClose}>
            <Icon icon='ri:delete-bin-7-line' fontSize='1.5rem' color='grey' />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <IconButton size='small' sx={{ mr: 3.5 }}>
            <Icon icon='ri:attachment-2' fontSize='1.3rem' color='grey' />
          </IconButton>
          <ButtonGroup variant='contained' ref={anchorRefSendBtn} aria-label='split button'>
            <Button
              onClick={handlePopupClose}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textTransform: 'none',
                margin: { xs: "2px" }
              }}
            >
              Send
              <Icon icon='ri:send-plane-line' fontSize='1rem' width='15' />
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ComposePopup