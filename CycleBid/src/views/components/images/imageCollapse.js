import React from 'react';
import { Grid, } from '@mui/material';
import ImageGallery from './imageGallery';

const ImageCollapse = ({ images }) => {

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          width: '100%' ,
          marginLeft: '0',
          marginRight: '0',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >

        <ImageGallery images={images.slice(0, 6)} />
        </Grid>
    </>
  );
};

export default ImageCollapse;





