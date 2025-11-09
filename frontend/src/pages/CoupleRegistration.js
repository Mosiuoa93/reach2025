import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button, Grid, 
  FormControl, InputLabel, Select, MenuItem, Box, Alert,
  Divider, Card, CardContent, IconButton, Chip
} from '@mui/material';
import { Group, Person, Email, Phone, Church, Public, Hotel, Payment, Add, Delete, FamilyRestroom } from '@mui/icons-material';
import AccommodationTooltip from '../components/AccommodationTooltip';

const CoupleRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pricing, setPricing] = useState({
    coupleBasePrice: 3000,
    childrenCount: 0,
    childRate: 1155,
    childrenTotal: 0,
    total: 3000,
    isEarlyBird: true,
    breakdown: {
      adults: 2,
      children: 0,
      totalPeople: 2
    }
  });
  const [formData, setFormData] = useState({
    partner1: {
      name: '',
      email: '',
      phone: '',
      gender: ''
    },
    partner2: {
      name: '',
      email: '',
      phone: '',
      gender: ''
    },
    church: '',
    country: '',
    accommodation: 'couple',
    payment: 'eft',
    dietaryRequirements: '',
    specialNeeds: '',
    children: []
  });

  // Fallback early bird detection
  const isEarlyBirdPeriod = () => {
    const now = new Date();
    const earlyBirdDeadline = new Date('2026-02-28');
    return now <= earlyBirdDeadline;
  };

  // Calculate couple pricing
  const calculateCouplePricing = () => {
    const isEarlyBird = isEarlyBirdPeriod();
    const coupleBasePrice = isEarlyBird ? 3000 : 3500;
    const childrenCount = formData.children.length;
    const childrenTotal = childrenCount * 1155;
    
    setPricing({
      coupleBasePrice,
      childrenCount,
      childRate: 1155,
      childrenTotal,
      total: coupleBasePrice + childrenTotal,
      isEarlyBird,
      breakdown: {
        adults: 2,
        children: childrenCount,
        totalPeople: 2 + childrenCount
      }
    });
  };

  // Recalculate pricing when children change
  useEffect(() => {
    calculateCouplePricing();
  }, [formData.children.length]);

  const handleInputChange = (partner, field, value) => {
    if (partner) {
      setFormData(prev => ({
        ...prev,
        [partner]: {
          ...prev[partner],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Children management functions
  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { name: '', age: '', gender: '' }]
    }));
  };

  const removeChild = (index) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
  };

  const updateChild = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.map((child, i) => 
        i === index ? { ...child, [field]: value } : child
      )
    }));
  };

  // Calculate total pricing using backend data
  const calculateTotal = () => {
    return pricing.total;
  };

  // Get child price for display
  const getChildPrice = (age) => {
    if (!age) return '-';
    return `R${pricing.childRate.toLocaleString()}`;
  };

  const validateForm = () => {
    const { partner1, partner2, church, country, accommodation, payment } = formData;
    
    if (!partner1.name || !partner1.email || !partner1.phone || !partner1.gender) {
      return 'Please complete all Partner 1 information';
    }
    if (!partner2.name || !partner2.email || !partner2.phone || !partner2.gender) {
      return 'Please complete all Partner 2 information';
    }
    if (partner1.email === partner2.email) {
      return 'Partners must have different email addresses';
    }
    if (!church || !country || !accommodation || !payment) {
      return 'Please complete all required fields';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = 'https://backend-old-smoke-6499.fly.dev';
      const response = await fetch(`${apiUrl}/api/register/couple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        navigate('/register/confirmation', { 
          state: { 
            type: 'couple',
            payment: formData.payment,
            summary: {
              partner1: formData.partner1.name,
              partner2: formData.partner2.name,
              church: formData.church,
              accommodation: formData.accommodation,
              children: formData.children,
              total: `R${calculateTotal().toLocaleString()}.00`
            }
          } 
        });
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Group sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Couple Registration
          </Typography>
          <Typography variant="h6" color="secondary" gutterBottom>
            REACH2026 Leader's Summit
          </Typography>
          
          {/* Modern Early Bird Banner */}
          {isEarlyBirdPeriod() && (
            <Box 
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                p: 3,
                mb: 3,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
              }}
            >
              {/* Decorative elements */}
              <Box sx={{ 
                position: 'absolute', 
                top: -10, 
                right: -10, 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.1)' 
              }} />
              <Box sx={{ 
                position: 'absolute', 
                bottom: -20, 
                left: -20, 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.05)' 
              }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Box sx={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  borderRadius: '50%', 
                  p: 1.5, 
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography sx={{ fontSize: '2rem' }}>💎</Typography>
                </Box>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                  Early Bird Family Special
                </Typography>
              </Box>
              
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.95)', mb: 2, lineHeight: 1.6 }}>
                Register before <strong>February 28, 2026</strong> and save R500!
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ color: '#f8bbd9', fontWeight: 'bold', fontSize: '1.1rem' }}>💑 Couple</Typography>
                  <Typography sx={{ color: 'white', fontSize: '0.9rem' }}>R3000 <span style={{textDecoration: 'line-through', opacity: 0.7}}>R3500</span></Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ color: '#81c784', fontWeight: 'bold', fontSize: '1.1rem' }}>👶 Children</Typography>
                  <Typography sx={{ color: 'white', fontSize: '0.9rem' }}>R1155 each</Typography>
                </Box>
              </Box>
            </Box>
          )}
          
          <Typography variant="body1" color="text.secondary">
            Registration Fee: <strong>R{calculateTotal().toLocaleString()}.00</strong>
            {formData.children.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                Includes {formData.children.length} child{formData.children.length !== 1 ? 'ren' : ''}
                (All children: R1,155 each)
              </Typography>
            )}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Partner 1 Information */}
          <Card sx={{ mb: 3, bgcolor: '#f8f9ff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" />
                Partner 1 Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.partner1.name}
                    onChange={(e) => handleInputChange('partner1', 'name', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.partner1.gender}
                      label="Gender"
                      onChange={(e) => handleInputChange('partner1', 'gender', e.target.value)}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.partner1.email}
                    onChange={(e) => handleInputChange('partner1', 'email', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.partner1.phone}
                    onChange={(e) => handleInputChange('partner1', 'phone', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <Phone sx={{ color: 'action.active', mr: 1 }} />
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Partner 2 Information */}
          <Card sx={{ mb: 3, bgcolor: '#fff8f8' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="secondary" />
                Partner 2 Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.partner2.name}
                    onChange={(e) => handleInputChange('partner2', 'name', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.partner2.gender}
                      label="Gender"
                      onChange={(e) => handleInputChange('partner2', 'gender', e.target.value)}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.partner2.email}
                    onChange={(e) => handleInputChange('partner2', 'email', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.partner2.phone}
                    onChange={(e) => handleInputChange('partner2', 'phone', e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <Phone sx={{ color: 'action.active', mr: 1 }} />
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Divider sx={{ my: 3 }} />

          {/* Shared Information */}
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Church color="primary" />
            Shared Information
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Church/Organization"
                value={formData.church}
                onChange={(e) => handleInputChange(null, 'church', e.target.value)}
                required
                InputProps={{
                  startAdornment: <Church sx={{ color: 'action.active', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                value={formData.country}
                onChange={(e) => handleInputChange(null, 'country', e.target.value)}
                required
                InputProps={{
                  startAdornment: <Public sx={{ color: 'action.active', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InputLabel>Accommodation</InputLabel>
                  <AccommodationTooltip type="couple" />
                </Box>
                <Select
                  value={formData.accommodation}
                  label="Accommodation"
                  onChange={(e) => handleInputChange(null, 'accommodation', e.target.value)}
                  startAdornment={<Hotel sx={{ color: 'action.active', mr: 1 }} />}
                >
                  <MenuItem value="couple">Couple Accommodation</MenuItem>
                  <MenuItem value="dorm">Dormitory (Shared)</MenuItem>
                  <MenuItem value="daypass">Day Pass Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.payment}
                  label="Payment Method"
                  onChange={(e) => handleInputChange(null, 'payment', e.target.value)}
                  startAdornment={<Payment sx={{ color: 'action.active', mr: 1 }} />}
                >
                  <MenuItem value="eft">EFT/Bank Transfer</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card Payment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dietary Requirements (Optional)"
                multiline
                rows={2}
                value={formData.dietaryRequirements}
                onChange={(e) => handleInputChange(null, 'dietaryRequirements', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Special Needs (Optional)"
                multiline
                rows={2}
                value={formData.specialNeeds}
                onChange={(e) => handleInputChange(null, 'specialNeeds', e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Children Information */}
          <Card sx={{ mt: 4, background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', border: '2px solid #ffb74d' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <FamilyRestroom sx={{ fontSize: 32, color: '#ff9800' }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="#e65100">
                    Children Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add children attending with the couple (All children: R1,155 each)
                  </Typography>
                </Box>
                <Box flexGrow={1} />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={addChild}
                  sx={{ 
                    background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
                    '&:hover': { background: 'linear-gradient(45deg, #f57c00 30%, #ff9800 90%)' }
                  }}
                >
                  Add Child
                </Button>
              </Box>

              {formData.children.length === 0 ? (
                <Box textAlign="center" py={3}>
                  <Typography variant="body1" color="text.secondary">
                    No children added. Click "Add Child" to include children in the registration.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {formData.children.map((child, index) => (
                    <Grid item xs={12} key={index}>
                      <Card sx={{ 
                        p: 2, 
                        background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                        border: '1px solid #e0e0e0'
                      }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Chip 
                            label={`Child ${index + 1}`} 
                            color="primary" 
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                          <Box flexGrow={1} />
                          <IconButton 
                            color="error" 
                            onClick={() => removeChild(index)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Child's Name"
                              value={child.name}
                              onChange={(e) => updateChild(index, 'name', e.target.value)}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              label="Age"
                              type="number"
                              value={child.age}
                              onChange={(e) => updateChild(index, 'age', e.target.value)}
                              inputProps={{ min: 0, max: 25 }}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <FormControl fullWidth required>
                              <InputLabel>Gender</InputLabel>
                              <Select
                                value={child.gender}
                                label="Gender"
                                onChange={(e) => updateChild(index, 'gender', e.target.value)}
                              >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Box display="flex" alignItems="center" height="100%">
                              <Typography variant="body2" color="primary" fontWeight="bold">
                                {child.age ? getChildPrice(child.age) : '-'}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Pricing Summary */}
              <Box mt={3} p={2} sx={{ background: '#e8f5e8', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="success.dark" gutterBottom>
                  Family Pricing Summary
                  {pricing.isEarlyBird && (
                    <Box component="span" sx={{ 
                      ml: 1, 
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: 2, 
                      background: 'linear-gradient(45deg, #667eea, #764ba2)', 
                      color: 'white', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}>
                      💎 Early Bird
                    </Box>
                  )}
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                  Couple Base Price: R{pricing.coupleBasePrice.toLocaleString()}.00
                </Typography>
                
                {pricing.childrenCount > 0 && (
                  <Typography variant="body1" gutterBottom>
                    Children ({pricing.childrenCount}): R{pricing.childrenTotal.toLocaleString()}.00
                    <span style={{ fontSize: '0.875rem', color: 'text.secondary', marginLeft: 8 }}>
                      (R{pricing.childRate.toLocaleString()} each)
                    </span>
                  </Typography>
                )}
                
                <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mt: 1 }}>
                  Total: R{pricing.total.toLocaleString()}.00
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {pricing.breakdown.totalPeople} people total ({pricing.breakdown.adults} adults
                  {pricing.childrenCount > 0 && ` + ${pricing.childrenCount} children`})
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box display="flex" gap={2} justifyContent="center" mt={4}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ minWidth: 120 }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                minWidth: 200,
                background: 'linear-gradient(45deg, #e91e63 30%, #9c27b0 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #c2185b 30%, #7b1fa2 90%)',
                }
              }}
            >
              {loading ? 'Registering...' : `Register Family - R${calculateTotal().toLocaleString()}`}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CoupleRegistration;
