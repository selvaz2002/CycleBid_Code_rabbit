import React from 'react';
import { Grid, Box } from '@mui/material';
import CurvedImage from './curvedImage';

const ImageGallery = ({ images,closeDisplay,minusWidth }) => {
  const imagesPerRow = 6;
  const imageSize = 150;


  const rows = Math.ceil(images.length / imagesPerRow);
  return (
    <Grid container justifyContent="flex-start" spacing={3}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {Array.isArray(images) &&
          images.slice(rowIndex * imagesPerRow, (rowIndex + 1) * imagesPerRow).map((imageSrc, index) => (
            <Grid item xs={12} sm={6} lg={2} key={index}>
              <Box
                sx={{
                  width:{lg :minusWidth ? `${imageSize-15}px` : '100%',xs:'100%'} ,
                  height: {lg :minusWidth ? `${imageSize-15}px` : `${imageSize}px`,xs:'100%'},
                  overflow: 'hidden',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <CurvedImage
                closeDisplay={closeDisplay}
                  src={imageSrc.url}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', 
                  }}
                />
              </Box>
            </Grid>
          ))}
        </React.Fragment>
      ))}
    </Grid>
  );
};

export default ImageGallery;



