import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  Avatar,
  Divider,
  Stack,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon,
  Undo as UndoIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Church as ChurchIcon,
  Hotel as HotelIcon,
  AttachMoney as MoneyIcon,
  Groups as GroupsIcon,
  PersonAdd as PersonAddIcon,
  Dashboard as DashboardIcon,
  QrCodeScanner as QrIcon
} from '@mui/icons-material';

const CheckinDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stats, setStats] = useState({
    totalIndividuals: 0,
    totalGroups: 0,
    totalCouples: 0,
    checkedInIndividuals: 0,
    checkedInGroups: 0,
    checkedInCouples: 0
  });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, registration: null, action: '' });

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/checkin/registrations`);
      const result = await response.json();
      
      if (result.success) {
        setRegistrations(result.data);
        setStats(result.stats);
      } else {
        throw new Error('Failed to fetch registrations');
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load registrations. Please refresh.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRegistrations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate total people count (individuals + group members + couples)
  const getTotalPeople = () => {
    const individuals = registrations.filter(r => r.type === 'individual').length;
    const couples = registrations.filter(r => r.type === 'couple').length * 2; // Each couple = 2 people
    const groupMembers = registrations
      .filter(r => r.type === 'group')
      .reduce((total, group) => {
        try {
          const members = typeof group.members === 'string' ? JSON.parse(group.members) : group.members;
          return total + (Array.isArray(members) ? members.length : 0) + 1; // +1 for leader
        } catch {
          return total + 1; // Just count the leader if members parsing fails
        }
      }, 0);
    return individuals + couples + groupMembers;
  };

  // Calculate checked-in people count
  const getCheckedInPeople = () => {
    const checkedInIndividuals = registrations.filter(r => r.type === 'individual' && r.checked_in).length;
    const checkedInCouples = registrations.filter(r => r.type === 'couple' && r.checked_in).length * 2; // Each couple = 2 people
    const checkedInGroupMembers = registrations
      .filter(r => r.type === 'group' && r.checked_in)
      .reduce((total, group) => {
        try {
          const members = typeof group.members === 'string' ? JSON.parse(group.members) : group.members;
          return total + (Array.isArray(members) ? members.length : 0) + 1; // +1 for leader
        } catch {
          return total + 1; // Just count the leader if members parsing fails
        }
      }, 0);
    return checkedInIndividuals + checkedInCouples + checkedInGroupMembers;
  };

  // Filter registrations based on search term
  const filteredRegistrations = useMemo(() => {
    if (!searchTerm) return registrations;
    const term = searchTerm.toLowerCase();
    return registrations.filter(reg => 
      reg.searchText.includes(term)
    );
  }, [registrations, searchTerm]);

  // Handle check-in
  const handleCheckin = async (registration) => {
    try {
      setCheckinLoading(registration.id);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const endpoint = registration.type === 'individual' 
        ? `${apiUrl}/api/checkin/individual/${registration.id}`
        : registration.type === 'couple'
          ? `${apiUrl}/api/checkin/couple/${registration.id}`
          : `${apiUrl}/api/checkin/group/${registration.id}`;
      
      const response = await fetch(endpoint, { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setRegistrations(prev => prev.map(reg => 
          reg.id === registration.id 
            ? { ...reg, checked_in: true, checkin_time: new Date().toISOString() }
            : reg
        ));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          checkedInIndividuals: registration.type === 'individual' 
            ? prev.checkedInIndividuals + 1 
            : prev.checkedInIndividuals,
          checkedInGroups: registration.type === 'group' 
            ? prev.checkedInGroups + 1 
            : prev.checkedInGroups,
          checkedInCouples: registration.type === 'couple' 
            ? prev.checkedInCouples + 1 
            : prev.checkedInCouples
        }));
        
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'success'
        });
      } else {
        throw new Error(result.error || 'Check-in failed');
      }
    } catch (error) {
      console.error('Error during check-in:', error);
      setSnackbar({
        open: true,
        message: 'Check-in failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setCheckinLoading(null);
      setConfirmDialog({ open: false, registration: null, action: '' });
    }
  };

  // Handle undo check-in
  const handleUndoCheckin = async (registration) => {
    try {
      setCheckinLoading(registration.id);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await fetch(
        `${apiUrl}/api/checkin/undo/${registration.type}/${registration.id}`,
        { method: 'POST' }
      );
      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setRegistrations(prev => prev.map(reg => 
          reg.id === registration.id 
            ? { ...reg, checked_in: false, checkin_time: null }
            : reg
        ));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          checkedInIndividuals: registration.type === 'individual' 
            ? prev.checkedInIndividuals - 1 
            : prev.checkedInIndividuals,
          checkedInGroups: registration.type === 'group' 
            ? prev.checkedInGroups - 1 
            : prev.checkedInGroups
        }));
        
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'info'
        });
      } else {
        throw new Error(result.error || 'Undo failed');
      }
    } catch (error) {
      console.error('Error undoing check-in:', error);
      setSnackbar({
        open: true,
        message: 'Undo failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setCheckinLoading(null);
      setConfirmDialog({ open: false, registration: null, action: '' });
    }
  };

  // Confirm action dialog
  const openConfirmDialog = (registration, action) => {
    setConfirmDialog({ open: true, registration, action });
  };

  const handleConfirmAction = () => {
    const { registration, action } = confirmDialog;
    if (action === 'checkin') {
      handleCheckin(registration);
    } else if (action === 'undo') {
      handleUndoCheckin(registration);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e3f0ff 0%, #f8e1f4 100%)',
      p: 3 
    }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Enhanced Header with Logo */}
      <Box sx={{ mb: 4 }}>
        {/* Modern Header Section */}
        <Paper
          elevation={6}
          sx={{
            mb: 4,
            borderRadius: 5,
            boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            background: 'white'
          }}
        >
          {/* Vibrant Gradient Bar */}
          <Box sx={{ 
            height: 8, 
            width: '100%', 
            background: 'linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)', 
            position: 'absolute', 
            top: 0, 
            left: 0 
          }} />
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center', 
            justifyContent: 'center', 
            p: 4,
            pt: 5
          }}>
          {/* Multi Ministries Logo */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mb: { xs: 2, sm: 0 },
            mr: { xs: 0, sm: 3 }
          }}>
            <img 
              src="/static/multi-ministries-logo.png" 
              alt="Multi Ministries" 
              style={{ 
                height: '80px', 
                width: 'auto',
                marginRight: '16px'
              }} 
            />
          </Box>
          
            {/* Title and Event Info */}
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <EventIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                <Typography variant="h3" component="h1" sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.8rem', sm: '2.5rem' },
                  background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  REACH2026
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ 
                color: 'text.secondary', 
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: '1.1rem', sm: '1.3rem' }
              }}>
                Live Registration Check-in
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Multi Ministries Event • {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Modern Vibrant Stats Dashboard */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Individual Registrations - Connected to Real Data */}
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(25, 118, 210, 0.25)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 32px 64px rgba(25, 118, 210, 0.35)'
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.25)', 
                  width: 56, 
                  height: 56,
                  mr: 3,
                  boxShadow: '0 8px 16px rgba(255,255,255,0.1)'
                }}>
                  <PersonIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h2" sx={{ 
                    fontWeight: 'bold', 
                    lineHeight: 1,
                    fontSize: '2.5rem'
                  }}>
                    {stats.totalIndividuals}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    opacity: 0.95,
                    fontWeight: 500
                  }}>
                    Individual Registrations
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(stats.checkedInIndividuals / stats.totalIndividuals) * 100 || 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    borderRadius: 4
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
                {stats.checkedInIndividuals} of {stats.totalIndividuals} checked in
              </Typography>
              </CardContent>
            </Card>
          </Grid>

        {/* Group Registrations */}
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(156, 39, 176, 0.25)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 32px 64px rgba(156, 39, 176, 0.35)'
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.25)', 
                  width: 56, 
                  height: 56,
                  mr: 3,
                  boxShadow: '0 8px 16px rgba(255,255,255,0.1)'
                }}>
                  <GroupsIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h2" sx={{ 
                    fontWeight: 'bold', 
                    lineHeight: 1,
                    fontSize: '2.5rem'
                  }}>
                    {stats.totalGroups}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    opacity: 0.95,
                    fontWeight: 500
                  }}>
                    Group Registrations
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.totalGroups > 0 ? (stats.checkedInGroups / stats.totalGroups) * 100 : 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    borderRadius: 4
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
                {stats.checkedInGroups} of {stats.totalGroups} checked in
              </Typography>
            </CardContent>
            </Card>
          </Grid>

        {/* Couples */}
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(233, 30, 99, 0.25)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 32px 64px rgba(233, 30, 99, 0.35)'
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.25)', 
                  width: 56, 
                  height: 56,
                  mr: 3,
                  boxShadow: '0 8px 16px rgba(255,255,255,0.1)'
                }}>
                  <GroupIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h2" sx={{ 
                    fontWeight: 'bold', 
                    lineHeight: 1,
                    fontSize: '2.5rem'
                  }}>
                    {stats.totalCouples}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    opacity: 0.95,
                    fontWeight: 500
                  }}>
                    Couple Registrations
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.totalCouples > 0 ? (stats.checkedInCouples / stats.totalCouples) * 100 : 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    borderRadius: 4
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
                {stats.checkedInCouples} of {stats.totalCouples} checked in
              </Typography>
            </CardContent>
            </Card>
          </Grid>
        {/* Total Attendees */}
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #00acc1 0%, #4dd0e1 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0, 172, 193, 0.25)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 32px 64px rgba(0, 172, 193, 0.35)'
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.25)', 
                  width: 56, 
                  height: 56,
                  mr: 3,
                  boxShadow: '0 8px 16px rgba(255,255,255,0.1)'
                }}>
                  <PeopleIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h2" sx={{ 
                    fontWeight: 'bold', 
                    lineHeight: 1,
                    fontSize: '2.5rem'
                  }}>
                    {getTotalPeople()}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    opacity: 0.95,
                    fontWeight: 500
                  }}>
                    Total Attendees
                  </Typography>
                </Box>
              </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(getCheckedInPeople() / getTotalPeople()) * 100 || 0}
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'rgba(255,255,255,0.8)'
                    }
                  }}
              />
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
                {getCheckedInPeople()} of {getTotalPeople()} checked in
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Overall Progress */}
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(255, 111, 0, 0.25)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 32px 64px rgba(255, 111, 0, 0.35)'
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ 
                  bgcolor: 'rgba(255,255,255,0.25)', 
                  width: 56, 
                  height: 56,
                  mr: 3,
                  boxShadow: '0 8px 16px rgba(255,255,255,0.1)'
                }}>
                  <TrendingUpIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box>
                  <Typography variant="h2" sx={{ 
                    fontWeight: 'bold', 
                    lineHeight: 1,
                    fontSize: '2.5rem'
                  }}>
                    {Math.round((getCheckedInPeople() / getTotalPeople()) * 100) || 0}%
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    opacity: 0.95,
                    fontWeight: 500
                  }}>
                    Event Progress
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(getCheckedInPeople() / getTotalPeople()) * 100 || 0}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    borderRadius: 4
                  }
                }}
              />
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
                {Math.round((getCheckedInPeople() / getTotalPeople()) * 100) || 0}% complete
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        </Grid>

      {/* Modern Search & Control Center */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <QrIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Search & Control Center
          </Typography>
        </Box>
        
        <Grid container spacing={3} alignItems="center">
          {/* Search Field */}
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="🔍 Search by name, email, phone, or group name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                  </InputAdornment>
                ),
                sx: { 
                  fontSize: '1.2rem', 
                  py: 2,
                  borderRadius: 3,
                  bgcolor: 'grey.50'
                }
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: 'grey.50',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    borderColor: 'primary.light'
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                    borderColor: 'primary.main',
                    boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                  }
                }
              }}
            />
          </Grid>
          
          {/* Action Buttons */}
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={fetchRegistrations}
                disabled={loading}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)'
                  }
                }}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
        
        {/* Search Results Info */}
        {searchTerm && (
          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              icon={<SearchIcon />}
              label={`Found ${filteredRegistrations.length} result${filteredRegistrations.length !== 1 ? 's' : ''} for "${searchTerm}"`}
              color="primary"
              variant="outlined"
              sx={{ 
                fontSize: '0.9rem',
                fontWeight: 500,
                py: 2,
                px: 1
              }}
            />
            {filteredRegistrations.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Try searching by name, email, phone number, or group name
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Modern Registration Cards */}
      {!loading && (
        <Box>
          {filteredRegistrations.length === 0 ? (
            <Paper sx={{ 
              p: 6, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: 3,
              border: '2px dashed #dee2e6'
            }}>
              <SearchIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                {searchTerm ? 'No registrations found' : 'No registrations available'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {searchTerm ? `No results match "${searchTerm}". Try a different search term.` : 'Registrations will appear here when available.'}
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredRegistrations.map((registration) => (
                <Grid item xs={12} key={`${registration.type}-${registration.id}`}>
                  <Card sx={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 3,
                    border: registration.checked_in ? '3px solid' : '2px solid',
                    borderColor: registration.checked_in ? 'success.main' : 'grey.200',
                    background: registration.checked_in 
                      ? 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    boxShadow: registration.checked_in 
                      ? '0 8px 32px rgba(76, 175, 80, 0.2)'
                      : '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: registration.checked_in 
                        ? '0 12px 40px rgba(76, 175, 80, 0.3)'
                        : '0 8px 30px rgba(0,0,0,0.12)'
                    }
                  }}>
                    {/* Status Banner */}
                    {registration.checked_in && (
                      <Box sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                        color: 'white',
                        px: 3,
                        py: 1,
                        borderBottomLeftRadius: 20,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        zIndex: 1
                      }}>
                        <CheckCircleIcon sx={{ fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          CHECKED IN
                        </Typography>
                      </Box>
                    )}
                    
                    <CardContent sx={{ p: 4 }}>
                      <Grid container spacing={3} alignItems="center">
                        {/* Avatar and Basic Info */}
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                            <Avatar sx={{ 
                              width: 64, 
                              height: 64,
                              background: registration.type === 'individual' 
                                ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                                : registration.type === 'couple'
                                  ? 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)'
                                  : 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                              fontSize: 24,
                              fontWeight: 'bold'
                            }}>
                              {registration.type === 'individual' ? (
                                <PersonIcon sx={{ fontSize: 32 }} />
                              ) : registration.type === 'couple' ? (
                                <GroupIcon sx={{ fontSize: 32 }} />
                              ) : (
                                <GroupsIcon sx={{ fontSize: 32 }} />
                              )}
                            </Avatar>
                            
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h5" sx={{ 
                                fontWeight: 'bold', 
                                mb: 1,
                                color: registration.checked_in ? 'success.dark' : 'text.primary'
                              }}>
                                {registration.displayName}
                              </Typography>
                              
                              <Stack spacing={1}>
                                {registration.type === 'individual' ? (
                                  <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {registration.email}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {registration.phone}
                                      </Typography>
                                    </Box>
                                  </>
                                ) : registration.type === 'couple' ? (
                                  <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {registration.partner1_email} • {registration.partner2_email}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {registration.partner1_phone} • {registration.partner2_phone}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <HotelIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {registration.accommodation} accommodation
                                      </Typography>
                                    </Box>
                                  </>
                                ) : (
                                  <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        Leader: {registration.leader_name}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {registration.leader_email}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {JSON.parse(registration.members || '[]').length} members
                                      </Typography>
                                    </Box>
                                  </>
                                )}
                              </Stack>
                            </Box>
                          </Box>
                        </Grid>
                        
                        {/* Details and Location */}
                        <Grid item xs={12} md={4}>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                                Details
                              </Typography>
                              <Stack spacing={1}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <ChurchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {registration.type === 'individual' ? registration.church : registration.type === 'couple' ? registration.church : registration.leader_church}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {registration.type === 'individual' ? registration.country : registration.type === 'couple' ? registration.country : registration.leader_country}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <HotelIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {registration.accommodation}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                    R{registration.total}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>
                            
                            {registration.checked_in && registration.checkin_time && (
                              <Box sx={{ 
                                p: 2, 
                                bgcolor: 'success.50', 
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'success.200'
                              }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <AccessTimeIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                                    Check-in Time
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="success.dark">
                                  {new Date(registration.checkin_time).toLocaleString()}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        </Grid>
                        
                        {/* Action Button */}
                        <Grid item xs={12} md={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            {!registration.checked_in ? (
                              <Button
                                variant="contained"
                                size="large"
                                startIcon={checkinLoading === registration.id ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                                onClick={() => openConfirmDialog(registration, 'checkin')}
                                disabled={checkinLoading === registration.id}
                                sx={{ 
                                  minWidth: 160,
                                  py: 2,
                                  px: 3,
                                  fontSize: '1.1rem',
                                  fontWeight: 'bold',
                                  borderRadius: 3,
                                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)'
                                  }
                                }}
                              >
                                {checkinLoading === registration.id ? 'Checking In...' : 'Check In'}
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                size="large"
                                startIcon={checkinLoading === registration.id ? <CircularProgress size={20} color="inherit" /> : <UndoIcon />}
                                onClick={() => openConfirmDialog(registration, 'undo')}
                                disabled={checkinLoading === registration.id}
                                sx={{ 
                                  minWidth: 160,
                                  py: 2,
                                  px: 3,
                                  fontSize: '1rem',
                                  fontWeight: 'bold',
                                  borderRadius: 3,
                                  borderWidth: 2,
                                  color: 'warning.main',
                                  borderColor: 'warning.main',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    borderWidth: 2,
                                    borderColor: 'warning.dark',
                                    bgcolor: 'warning.50',
                                    transform: 'translateY(-2px)'
                                  }
                                }}
                              >
                                {checkinLoading === registration.id ? 'Undoing...' : 'Undo Check-in'}
                              </Button>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, registration: null, action: '' })}>
        <DialogTitle>
          {confirmDialog.action === 'checkin' ? 'Confirm Check-in' : 'Confirm Undo Check-in'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.action === 'checkin' 
              ? `Are you sure you want to check in ${confirmDialog.registration?.displayName}?`
              : `Are you sure you want to undo the check-in for ${confirmDialog.registration?.displayName}?`
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, registration: null, action: '' })}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmAction}
            variant="contained"
            color={confirmDialog.action === 'checkin' ? 'primary' : 'warning'}
          >
            {confirmDialog.action === 'checkin' ? 'Check In' : 'Undo'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%', fontSize: '1rem' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Container>
    </Box>
  );
};

export default CheckinDashboard;
