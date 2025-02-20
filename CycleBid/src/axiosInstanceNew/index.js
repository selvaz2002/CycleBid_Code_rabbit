import axios from 'axios';
import Router from 'next/router';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import Icon from 'src/@core/components/icon'
import { Button, Dialog, DialogContent, IconButton, Typography, Box } from '@mui/material'

const showCustomDialog = (message) => {
  const DialogComponent = () => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
      setOpen(false);
      const dialogRoot = document.getElementById('dialog-root');
      if (dialogRoot) ReactDOM.unmountComponentAtNode(dialogRoot); 
    };

    return (
      <Dialog open={open} onClose={handleClose} aria-labelledby='auction-dialog-title'
        aria-describedby='auction-dialog-description'
        maxWidth='xs'
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '20px'
          }
        }}>
        <DialogContent>
          <Box display='flex' justifyContent='center' marginBottom={10} sx={{ margin: '30px' }}>
            <IconButton sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
              <Icon icon='ix:namur-failure-filled' width='78' height='78' color='red' />
            </IconButton>
          </Box>
          <Box textAlign='center' sx={{ marginBottom: '20px' }}>
            <Typography fontSize={20} marginTop={3} color={'black'} marginBottom={5}>
              {message}
            </Typography>
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                fontSize: '1rem',
                textTransform: 'none',
                backgroundColor: 'red',
                '&:hover': {
                  backgroundColor: 'red'
                }
              }}
            >
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };

  let dialogRoot = document.getElementById('dialog-root');
  if (!dialogRoot) {
    dialogRoot = document.createElement('div');
    dialogRoot.id = 'dialog-root';
    document.body.appendChild(dialogRoot);
  }

  ReactDOM.render(<DialogComponent />, dialogRoot);
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout Error:', error.message);
      showCustomDialog('The request took too long to respond. Please try again later.');
    } else if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.clear();
        sessionStorage.clear();
        Router.replace('/login');

        Router.reload();
      } else {
        console.error('Error response:', error.response.data);
      }
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Unexpected Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;