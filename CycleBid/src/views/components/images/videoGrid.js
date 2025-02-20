import React from 'react';
import { Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';


const CurvedImage = styled('img')({
  width: '100%',
  borderRadius: '8px',
  objectFit: 'cover',
});

const VideoCard = styled('div')({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const VideoGrid = () => {
  return (
    <Grid container justifyContent="flex-start" spacing={3}>
      {videoData.map((video, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          lg={index % 2 === 0 ? 6 : 6}
          key={index}
          sx={{
            paddingLeft: index % 2 === 0 ? 0 : 2,
            paddingRight: 2,
          }}
        >
          <VideoCard>

            <CurvedImage src={video.thumbnail} alt={`Video ${index + 1}`} />

            <IconButton
              sx={{
                marginTop: '10px',
                color: 'white',
                background: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  background: 'rgba(0, 0, 0, 0.7)',
                },
              }}

            >
             
              <span style={{ color: 'white', fontSize: '16px' }}>X</span>
            </IconButton>
          </VideoCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default VideoGrid;
