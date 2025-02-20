import React from 'react';
import { Button } from '@mui/material';

const OutlinedBadge = ({text}) => {
  return (
        <Button
          variant="outlined"
          sx={{
            borderColor: 'primary',
            color: 'primary',
            marginLeft:"5px",
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

export default OutlinedBadge;
