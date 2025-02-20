import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

const CurvedImage = ({ src, closeDisplay }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img
        src={src}
        alt="Curved Image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '10px',
        }}
      />

      {closeDisplay && (
        <IconButton
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'white',
            borderRadius: '50%',
            color: 'black',
            padding: '2px',
            fontSize: '14px',
            zIndex: 1, 
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </div>
  );
};

export default CurvedImage;


