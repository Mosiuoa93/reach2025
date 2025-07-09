import React from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function Footer() {
  return (
    <Box sx={{
      width: '100%',
      mt: 6,
      py: 2,
      background: 'linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)',
      color: '#fff',
      textAlign: 'center',
      fontSize: 16,
      letterSpacing: 1,
      position: 'relative',
      zIndex: 2
    }}>
      <Typography variant="body2" sx={{ fontWeight: 400 }}>
        &copy; {new Date().getFullYear()} Multi Ministries. All rights reserved. | Contact: info@multiministries.co.za
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }}>
        <IconButton
          component="a"
          href="https://www.facebook.com/multiministries"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          sx={{ color: '#fff', '&:hover': { color: '#1976d2', background: '#fff' } }}
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          component="a"
          href="https://youtube.com/@multiministries"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          sx={{ color: '#fff', '&:hover': { color: '#d32f2f', background: '#fff' } }}
        >
          <YouTubeIcon />
        </IconButton>
        <IconButton
          component="a"
          href="https://wa.me/27795956568"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          sx={{ color: '#fff', '&:hover': { color: '#25d366', background: '#fff' } }}
        >
          <WhatsAppIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
