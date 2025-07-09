import React from 'react';
import { Typography, Button, Stack, IconButton, Paper, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const ChoicePage = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #e3f0ff 0%, #f8e1f4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 420,
          width: '100%',
          px: { xs: 2, sm: 5 },
          py: { xs: 3, sm: 5 },
          borderRadius: 5,
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.10)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeIn 1s',
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: '0 16px 40px rgba(25, 118, 210, 0.15)',
          },
        }}
      >
        <Box sx={{ height: 8, width: '100%', background: 'linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)', borderRadius: '8px 8px 0 0', position: 'absolute', top: 0, left: 0 }} />
        <IconButton
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', top: 16, left: 8, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', borderRadius: '50%', padding: 8, zIndex: 2 }}
          aria-label="Back"
          size="large"
        >
          <ArrowBackIcon style={{ fontSize: 32, color: '#1976d2' }} />
        </IconButton>
        <img src="/logo.png" alt="Multi Ministries Logo" style={{ width: 120, margin: '32px auto 20px auto', display: 'block' }} />
        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom sx={{ mt: 2 }}>
          Register as an:
        </Typography>
        <Stack spacing={4} direction="column" alignItems="center" mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{
              fontWeight: 600,
              borderRadius: 8,
              padding: '14px 0',
              fontSize: 18,
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.07)',
              transition: 'all 0.2s',
              '&:hover, &:focus': {
                background: 'linear-gradient(90deg, #1976d2 60%, #9c27b0 100%)',
                color: '#fff',
                boxShadow: '0 6px 18px rgba(76, 0, 130, 0.13)'
              }
            }}
            onClick={() => navigate('/register/individual')}
          >
            Individual
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            fullWidth
            sx={{
              fontWeight: 600,
              borderRadius: 8,
              padding: '14px 0',
              fontSize: 18,
              borderWidth: 2,
              transition: 'all 0.2s',
              '&:hover, &:focus': {
                background: '#ede7f6',
                color: '#512da8',
                borderColor: '#512da8',
                boxShadow: '0 4px 16px rgba(76, 0, 130, 0.12)'
              }
            }}
            onClick={() => navigate('/register/group')}
          >
            Group
          </Button>
        </Stack>
      </Paper>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
};

export default ChoicePage;
