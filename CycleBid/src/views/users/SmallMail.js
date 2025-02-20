import { useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import ButtonGroup from '@mui/material/ButtonGroup'
import Icon from 'src/@core/components/icon'
import { EditorState } from 'draft-js'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const ComposePopup = props => {
  const { mdAbove, composeOpen, composePopupWidth, toggleComposeOpen, toMailId } = props

  const [emailTo, setEmailTo] = useState(toMailId ? [{ name: toMailId }] : [])
  const [ccValue, setccValue] = useState([])
  const [subjectValue, setSubjectValue] = useState('')
  const [bccValue, setbccValue] = useState([])
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const editorRef = useRef(null);

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

  const blockStyleFn = contentBlock => {
    console.log('cweliwebcweblcjwe')
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

  function focusEditor() {
    if (editorRef.current && editorRef.current.editor) {
      editorRef.current.editor.focus();
    }
  }

  const handlePopupClose = () => {
    toggleComposeOpen()
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
  const uploadImageCallback = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ data: { link: reader.result } });
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <Drawer
      anchor='bottom'
      open={composeOpen}
      variant='permanent'
      onClose={toggleComposeOpen}
      sx={{
        display: 'flex',
        minWidth: { xs: '125% !important', sm: '110% !important', md: '60% !important', lg: "106.6% !important" },
        minHeight: '460px !important',
        overflow: "hidden",
        flexDirection: 'column',
        '& .MuiDrawer-paper': {
          borderRadius: 2,
          position: 'static',
          width: { md: '850px', lg: '93.7%' },
          minHeight: '200px !important',
          margin: { xs: '15px 30px ', lg: "15px 31.9px" },
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          zIndex: 5,
          backgroundColor: '#fff !important'
        }
      }}
    >
      <Box
        sx={{
          px: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: theme => `1px solid ${theme.palette.divider}`,
        }}
      ></Box>

      <Box
        sx={{
          py: 2,
          px: 4,
          fontSize: '15px',
          alignItems: 'center',
        }}
      >
        Reply to Ross Geller
      </Box>

      <div onClick={focusEditor}>
        <EditorWrapper
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
              minHeight: { xs: 'auto', lg: '3rem !important' }
            },
            '& .rdw-link-modal, & .rdw-image-modal': {
              position: { xs: "absolute", md: "none !important" },
              zIndex: 1500,
              width: '300px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              backgroundColor: '#fff',
              overflow: 'visible',
              transformOrigin: 'top left',
              top: { xs: '80%', md: "-15" },
              left: { xs: '50%', md: "-10" },
              transform: { xs: 'translate(-70%, 10%)', md: 'translate(0%, 0%)' },
            },

          }}
        >
          <ReactDraftWysiwyg
            editorState={editorState}
            onEditorStateChange={editorState => setEditorState(editorState)}
            placeholder='Write Your Message......'
            blockStyleFn={blockStyleFn}
            customStyleMap={customStyleMap}
            toolbar={{
              options: ['inline', 'list', 'textAlign', 'link', 'image'],
              inline: {
                inDropdown: false,
                options: ['bold', 'italic', 'underline'],
                bold: { icon: "/images/icons/heroicons--bold-solid.svg" },
                italic: { icon: "/images/icons/tabler--italic.svg" },
                underline: { icon: "/images/icons/mingcute--underline-line.svg" },
              },
              list: {
                inDropdown: false,
                options: ['ordered', 'unordered'],
                ordered: { icon: "/images/icons/ri--list-ordered.svg" },
                unordered: { icon: "/images/icons/ri--list-unordered.svg" },
              },
              textAlign: {
                inDropdown: false,
                options: [],
              },
              link: {
                inDropdown: false,
                options: ["link"],
                link: { icon: "/images/icons/ri--link.svg" },
              },
              image: {
                icon: "/images/icons/ri--image-2-line.svg",
                uploadCallback: uploadImageCallback,
                previewImage: true,
                alt: { present: true, mandatory: false },
              },
            }}
            toolbarStyle={{
              padding: '0px !important',
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }}
          />
        </EditorWrapper>
      </div>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
        }}
      ></Box>

      <Box
        sx={{
          px: 4,
          py: 3.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size='small' onClick={handlePopupClose}></IconButton>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: { xs: "wrap", md: "nowrap" },
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <IconButton size='small' sx={{ mr: 3.5 }}>
            <Icon icon='ri:attachment-2' fontSize='1.3rem' color='grey' />
            Attachments
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