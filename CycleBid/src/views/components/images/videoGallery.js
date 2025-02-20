import React, { useState } from 'react';
import { Grid, Modal, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';

const VideoWrapper = styled('div')({
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 16',
  borderRadius: '12px',
  overflow: 'hidden',
  cursor: 'pointer',
  backgroundColor: '#000',
});

const StyledVideo = styled('video')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const PlayButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '48px',
  color: '#000',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
});


const ModalBox = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  maxWidth: '800px',
  aspectRatio: '16 / 9',
  backgroundColor: '#000',
  borderRadius: '15px',
  boxShadow: 24,
  outline: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const VideoGallery = ({ videoUrls, closeDisplay }) => {
  const [open, setOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('');

  const handleOpen = (url) => {
    setSelectedVideo(url);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedVideo('');
    setOpen(false);
  };

  return (
    <div>
      <Grid container spacing={5}>
        {Array.isArray(videoUrls) &&
        videoUrls.map((url, index) => (
          <Grid item xs={12} sm={4} lg={2} key={index}>
            <VideoWrapper onClick={() => handleOpen(url.url)}>
              <StyledVideo src={url.url} />
              <PlayButton>
                <PlayArrowIcon fontSize="medium" />
              </PlayButton>
            </VideoWrapper>
            {closeDisplay && <Box sx={{ textAlign: 'center', marginTop: 2 }}>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: 'black',
                  backgroundColor: 'transparent',
                  border: '1px solid black',
                }}
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            </Box>}
          </Grid>
        ))}
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <ModalBox>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#fff',
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedVideo && (
            <video
              src={selectedVideo}
              controls
              autoPlay
              style={{
                width: '100%',
                maxHeight: '500px',
                borderRadius: '12px',
              }}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </ModalBox>
      </Modal>
    </div>
  );
};

export default VideoGallery;
