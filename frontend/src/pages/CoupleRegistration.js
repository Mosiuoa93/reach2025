import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button, Grid, 
  FormControl, InputLabel, Select, MenuItem, Box, Alert,
  Divider, Card, CardContent, IconButton, Chip
} from '@mui/material';
import { Group, Person, Email, Phone, Church, Public, Hotel, Payment, Add, Delete, FamilyRestroom } from '@mui/icons-material';

const CoupleRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  // Calculate total pricing including children
  const calculateTotal = () => {
    let total = 2600; // Base couple price
    
    formData.children.forEach(child => {
      const age = parseInt(child.age);
      if (age >= 12 && age <= 18) {
        total += 1300; // Half price for teens
      } else if (age > 18) {
        total += 2600; // Full price for adults
      }
      // Children under 12 are free
    });
    
    return total;
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
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/register/couple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        navigate('/confirmation', { 
          state: { 
            type: 'couple',
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
          <Typography variant="body1" color="text.secondary">
            Registration Fee: <strong>R{calculateTotal().toLocaleString()}.00</strong>
            {formData.children.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                Includes {formData.children.length} child{formData.children.length !== 1 ? 'ren' : ''}
                (Under 12: Free • 12-18: R1,300 • 18+: R2,600)
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
                <InputLabel>Accommodation</InputLabel>
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
                    Add children attending with the couple (Under 12: Free • 12-18: R1,300 • 18+: R2,600)
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
                                {child.age ? (
                                  parseInt(child.age) < 12 ? 'Free' :
                                  parseInt(child.age) <= 18 ? 'R1,300' : 'R2,600'
                                ) : '-'}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}

              {formData.children.length > 0 && (
                <Box mt={3} p={2} sx={{ background: '#e8f5e8', borderRadius: 2 }}>
                  <Typography variant="body1" fontWeight="bold" color="success.dark">
                    Total with Children: R{calculateTotal().toLocaleString()}.00
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Base couple fee (R2,600) + {formData.children.length} child{formData.children.length !== 1 ? 'ren' : ''}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box display="flex" gap={2} justifyContent="center" mt={4}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/choice')}
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
