import { useState } from 'react';
import { Grid, Card, Box, Typography, Button, CardHeader, IconButton, Avatar, TextField, Toolbar, Input, Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import AttachmentIcon from '@mui/icons-material/Attachment';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';


const UserViewConnection = () => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [image, setImage] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composeEmail, setComposeEmail] = useState({
    to: '',
    subject: '',
    body: '',
  });

  const emails = [
    { id: 1, subject: 'UI/UX Designer', sender: 'Adalberto Granzin', senderEmail: 'john.doe@example.com', body: 'I hope this message finds you well. I wanted to take a moment to update you on the progress of your UI/UX design project.We have defined the key steps a user will take within the app. This will be used as the foundation for the next design iterations.', date: 'Thu Jan 13 2022 11:14 AM', avatar: '/images/avatars/4.png' },
    { id: 2, subject: 'Project Update', sender: 'Jane Smith', senderEmail: 'jane.smith@example.com', body: 'The project deadline is coming up. Please check the latest updates.We’ve chosen a clean, minimalist design with soft color tones to ensure that the app is visually appealing and user-friendly. The color scheme aligns with your brand guidelin', date: 'Wen Oct 02 2022 12:15 PM', avatar: '/images/avatars/7.png' },
    { id: 3, subject: 'Invoice Details', sender: 'Accounts', senderEmail: 'accounts@example.com', body: 'wellish laminable ineunt popshop catalyte prismatize campimetrical lentisk excluding portlet coccinellid impestation Bangash Lollardist perameloid procerebrum presume cashmerette washbasin nainsook Odontolcae Alea holcodont weltedcibarious terrifical uploop naphthaleneacetic containable nonsailor Zwinglian blighty benchful guar porch fallectomy building coinvolve eidolism warmth unclericalize seismographic recongeal ethanethial clog regicidal regainment legif', date: 'Wen Feb 13 2022 12:15 PM', avatar: '/images/avatars/3.png' },
    { id: 4, subject: 'Newsletter', sender: 'Company', senderEmail: 'company@example.com', body: 'Would you be available for a call tomorrow at 3 PM to go over everything? Please let us know if that time works for you, or feel free to suggest another time that suits your schedule.', date: 'Wen Dec 13 2022 12:15 PM', avatar: '/images/avatars/2.png' },
    { id: 5, subject: 'Java Programmer', sender: 'Programming', senderEmail: 'javaprogrammers@example.com', body: 'Would you be available for a call tomorrow at 3 PM to go over everything? Please let us know if that time works for you, or feel free to suggest another time that suits your schedule.', date: 'Wen Dec 19 2022 12:15 PM', avatar: '/images/avatars/2.png' },
  ];

  const handleComposeClick = () => {
    setIsComposing(true);
    setSelectedEmail(null);
    setAttachments([]);
    setImage(null);
  };
  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setIsComposing(false);
  };

  const handleReplyChange = (event) => {
    setReplyText(event.target.value);
    setIsComposing(false);
  };
  const handleDiscard = () => {
    setIsComposing(false);
  };
  const handleTextFormat = (formatType) => {
    switch (formatType) {
      case 'bold':
        setReplyText((prevText) => `<b>${prevText}</b>`);
        break;
      case 'italic':
        setReplyText((prevText) => `<i>${prevText}</i>`);
        break;
      case 'underline':
        setReplyText((prevText) => `<u>${prevText}</u>`);
        break;
      case 'ordered-list':
        setReplyText((prevText) => `<ol><li>${prevText.replace(/\n/g, '</li><li>')}</li></ol>`);
        break;
      case 'unordered-list':
        setReplyText((prevText) => `<ul><li>${prevText.replace(/\n/g, '</li><li>')}</li></ul>`);
        break;
      default:
        break;
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleAttachment = (event) => {
    const files = event.target.files;
    setAttachments([...attachments, ...files]);
  };

  const handleSend = () => {
    console.log('Sending email with reply:', replyText);
    console.log('Attachments:', attachments);
    console.log('Sending email:', composeEmail);
    console.log('Attachments:', attachments);
    setIsComposing(false);
    setReplyText('');
    setAttachments([]);
    setImage(null);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4} sx={{ mt: 4 }}>
        <Card sx={{ padding: 2, backgroundColor: '#F7F7F9', height: '100%' }}>
          <Card sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100px',
            backgroundColor: '#F7F7F9',
            height: '78px'
          }}>
            <Button
              variant="contained"
              size="large"
              color="primary"
              sx={{
                textTransform: 'none',
                width: '266px',
                height: '38px',
                fontSize: '1rem',
              }}
              onClick={handleComposeClick}
            >
              Compose
            </Button>
          </Card>
          <CardHeader
            title={
              <Typography
                sx={{
                  color: "#1E70EB",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Messages
              </Typography>
            }
          />

          <Box sx={{
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
            height: '100%'
          }}>
            {emails.map((email) => (
              <Box
                key={email.id}
                sx={{
                  cursor: 'pointer',
                  padding: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  "&:hover": { backgroundColor: '#e3e3e3' },
                }}
                onClick={() => handleEmailClick(email)}
              >

                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2" sx={{ fontSize: '15px', color: '#262B43E5' }}>
                    {email.sender}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '13px', color: '#262B43B2' }}>
                    {email.subject}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: '#262B4366', fontSize: '13px' }}>
                  {new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Typography>
              </Box>
            ))}
          </Box>

        </Card>
      </Grid>

      <Grid item xs={12} md={8} sx={{ mt: 8 }}>
      <Card sx={{ padding: 2 }}>
          {isComposing ? (
            <>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="To"
                  value={composeEmail.to}
                  onChange={(e) => handleInputChange('to', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Subject"
                  value={composeEmail.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>

              <Box>
                <Toolbar sx={{ borderBottom: '1px solid #e0e0e0', mb: 2 }}>
                  <IconButton>
                    <FormatBoldIcon />
                  </IconButton>
                  <IconButton>
                    <FormatItalicIcon />
                  </IconButton>
                  <IconButton>
                    <FormatUnderlinedIcon />
                  </IconButton>
                  <IconButton component="label">
                    <InsertPhotoIcon />
                    <Input
                      type="file"
                      accept="image/*"
                      sx={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </IconButton>
                  <IconButton component="label">
                    <AttachmentIcon />
                    <Input
                      type="file"
                      accept="*/*"
                      sx={{ display: 'none' }}
                      multiple
                      onChange={handleAttachment}
                    />
                  </IconButton>
                </Toolbar>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                  placeholder="Write your message..."
                  value={composeEmail.body}
                  onChange={(e) => handleInputChange('body', e.target.value)}
                />
              </Box>

              {image && <img src={image} alt="Uploaded" style={{ width: '100px', marginTop: '10px' }} />}
              {attachments.length > 0 && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {attachments.length} file(s) attached
                </Typography>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button onClick={handleDiscard} sx={{ mr: 2 }}>
                  Discard
                </Button>
                <Button variant="contained" color="primary" onClick={handleSend}>
                  Send
                </Button>
              </Box>
            </>
          ) : (
            <Typography>Select an email or click "Compose" to start writing.</Typography>
          )}
        </Card>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ padding: 2 }}>
              {!selectedEmail ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="textSecondary">
                    Select an email to view or compose
                  </Typography>
                </Box>
              ) : (
                <>
                  <CardHeader
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 0,
                    }}
                    avatar={
                      <Avatar
                        alt={selectedEmail.sender}
                        src={selectedEmail.avatar}
                        sx={{ width: 40, height: 40 }}
                      />
                    }
                    title={
                      <Typography variant="body1" sx={{ fontSize: '15px', color: '#262B43E5' }}>
                        {selectedEmail.sender}
                      </Typography>
                    }
                    subheader={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontSize: '13px', color: '#262B43B2', flexGrow: 1 }}
                        >
                          {selectedEmail.senderEmail}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '13px',
                            color: 'gray',
                            marginRight: '8px',
                          }}
                        >
                          {selectedEmail.date}
                        </Typography>
                        <IconButton>
                          <AttachmentIcon />
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    }
                  />

                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontSize: '15px', color: '#262B43B2' }}>
                      {selectedEmail.body}
                    </Typography>
                  </Box>
                </>
              )}
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ padding: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Reply to {selectedEmail ? selectedEmail.sender : '...'}
              </Typography>

              <Toolbar sx={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 1 }}>
                <IconButton onClick={() => handleTextFormat('bold')}>
                  <FormatBoldIcon />
                </IconButton>
                <IconButton onClick={() => handleTextFormat('italic')}>
                  <FormatItalicIcon />
                </IconButton>
                <IconButton onClick={() => handleTextFormat('underline')}>
                  <FormatUnderlinedIcon />
                </IconButton>
                <IconButton onClick={() => handleTextFormat('ordered-list')}>
                  <FormatListNumberedIcon />
                </IconButton>
                <IconButton onClick={() => handleTextFormat('unordered-list')}>
                  <FormatListBulletedIcon />
                </IconButton>
                <IconButton>
                  <InsertPhotoIcon />
                  <Input
                    accept="image/*"
                    id="upload-image"
                    type="file"
                    sx={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </IconButton>
                <IconButton>
                  <AttachmentIcon />
                  <Input
                    accept="*/*"
                    id="upload-attachment"
                    type="file"
                    sx={{ display: 'none' }}
                    multiple
                    onChange={handleAttachment}
                  />
                </IconButton>
              </Toolbar>

              <TextField
                label="Write your message..."
                multiline
                rows={6}
                variant="outlined"
                sx={{ width: '100%', mt: 2 }}
                value={replyText}
                onChange={handleReplyChange}
              />

              {image && <img src={image} alt="Uploaded" style={{ width: '100px', marginTop: '10px' }} />}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  sx={{
                    color: 'black',
                    marginRight: 1,
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  startIcon={<AttachmentIcon />}
                  component="label"
                >
                  Attachments
                  <Input
                    accept="*/*"
                    id="upload-attachment"
                    type="file"
                    sx={{ display: 'none' }}
                    multiple
                    onChange={handleAttachment}
                  />
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSend}
                  sx={{
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Send
                  <Box sx={{ marginLeft: '8px' }}>
                    <i className="ri-send-plane-line"></i> 
                  </Box>
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserViewConnection;
