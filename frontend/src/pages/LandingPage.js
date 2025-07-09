import React from 'react';
import { Button, Typography, Paper, Box } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
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
      <Button
        variant="outlined"
        color="secondary"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 2,
          transition: 'all 0.2s',
          '&:hover, &:focus': {
            background: '#ede7f6',
            color: '#512da8',
            boxShadow: '0 4px 16px rgba(76, 0, 130, 0.12)'
          }
        }}
        onClick={() => navigate('/admin')}
      >
        Admin
      </Button>
      <Paper
        elevation={6}
        sx={{
          maxWidth: 480,
          width: '100%',
          px: { xs: 2, sm: 5 },
          py: { xs: 3, sm: 5 },
          borderRadius: 5,
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.10)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeIn 1s',
          transition: 'box-shadow 0.3s'
        }}
      >
        <Box sx={{ height: 8, width: '100%', background: 'linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)', borderRadius: '8px 8px 0 0', position: 'absolute', top: 0, left: 0 }} />
        <img src="/logo.png" alt="Multi Ministries Logo" style={{ width: 250, marginBottom: 24, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
        <Typography variant="h4" align="center" fontWeight={700} color="primary" gutterBottom sx={{ mt: 2 }}>
          REACH Leader's Summit
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3, color: '#444' }}>
          Welcome to official registration portal for Multi Ministries Event
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <EventIcon color="secondary" sx={{ mr: 1 }} />
          <Typography variant="body1" fontWeight={600} color="#9c27b0">
            25 - 28 August 2025
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <PlaceIcon color="primary" sx={{ mr: 1 }} />
          <a
            href="https://www.google.com/maps/dir//Zeekoegat,+14+Kameeldrift+Weg,+Roodeplaat,+Pretoria,+0032/@-25.639578,28.2520012,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x1ebfe17f367a724f:0xf921493adc89850e!2m2!1d28.3344027!2d-25.6396011?entry=ttu&g_ep=EgoyMDI1MDcwNi4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600, fontSize: 16 }}
          >
            Joy Unspeakable, Roodeplaat, Pretoria
          </a>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{
            fontWeight: 600,
            borderRadius: 8,
            padding: '16px 0',
            fontSize: 20,
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.13)',
            mb: 2,
            transition: 'all 0.2s',
            '&:hover, &:focus': {
              background: 'linear-gradient(90deg, #1976d2 60%, #9c27b0 100%)',
              color: '#fff',
              boxShadow: '0 6px 18px rgba(76, 0, 130, 0.13)'
            }
          }}
          onClick={() => navigate('/register')}
        >
          Register Now
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
            mb: 1,
            transition: 'all 0.2s',
            '&:hover, &:focus': {
              background: '#ede7f6',
              color: '#512da8',
              borderColor: '#512da8',
              boxShadow: '0 4px 16px rgba(76, 0, 130, 0.12)'
            }
          }}
          href="https://www.multiministries.co.za/who-we-are/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InfoOutlinedIcon sx={{ mr: 1 }} />
          About Multi Ministries
        </Button>
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

export default LandingPage;
