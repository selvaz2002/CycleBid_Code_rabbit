import React from 'react';
import { Button } from '@mui/material';

const FilledBadge = ({text,colour}) => {
  return (
        <Button
          variant="contained"
          sx={{
            borderColor: 'primary',
            color: 'primary',
            backgroundColor: colour || 'primary.main',
            padding: '1px 18px',
            borderRadius: '25px',
            textTransform: 'none',
            minWidth: 'auto',
          }}
        >
          {text}
        </Button>
  );
};

export default FilledBadge;



