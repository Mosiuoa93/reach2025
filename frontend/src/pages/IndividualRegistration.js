import React, { useState, useEffect } from 'react';
import { Typography, TextField, FormControlLabel, Checkbox, Button, Radio, RadioGroup, FormControl, FormLabel, FormGroup, FormHelperText, IconButton, Paper, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccommodationTooltip from '../components/AccommodationTooltip';

const days = [
  { label: 'Day 1', value: 'day1' },
  { label: 'Day 2', value: 'day2' },
  { label: 'Day 3', value: 'day3' }
];

import { useNavigate } from 'react-router-dom';

export default function IndividualRegistration() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    gender: '',
    email: '',
    phone: '',
    church: '',
    country: '',
    emergencyName: '',
    emergencyContact: '',
    indemnity: false,
    accommodation: '',
    bedding: false,
    dayPass: [],
    dayPassMeals: true, // true = with meals (R230), false = entry only (free)
    payment: '',
    commitment: false,
    registrationType: 'regular', // regular, earlybird, student
  });
  const [errors, setErrors] = useState({});
  const [pricingInfo, setPricingInfo] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fallback early bird detection
  const isEarlyBirdPeriod = () => {
    // Use backend info if available, otherwise calculate locally
    if (pricingInfo?.isEarlyBird !== undefined) {
      return pricingInfo.isEarlyBird;
    }
    // Fallback to local calculation
    const now = new Date();
    const earlyBirdDeadline = new Date('2026-02-28');
    return now <= earlyBirdDeadline;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      let updatedForm = { ...form, [name]: value };
      
      // If guesthouse is selected and current registration type is student, switch to regular
      if (name === 'accommodation' && value === 'guesthouse' && form.registrationType === 'student') {
        updatedForm.registrationType = 'regular';
      }
      
      setForm(updatedForm);
    }
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    let updated = [...form.dayPass];
    if (checked) {
      updated.push(value);
    } else {
      updated = updated.filter((d) => d !== value);
    }
    setForm({ ...form, dayPass: updated });
  };

  const validate = () => {
    let newErrors = {};
    if (!form.name) newErrors.name = 'Required';
    if (!form.gender) newErrors.gender = 'Required';
    if (!form.email) newErrors.email = 'Required';
    if (!form.phone) newErrors.phone = 'Required';
    if (!form.church) newErrors.church = 'Required';
    if (!form.country) newErrors.country = 'Required';
    if (!form.emergencyName) newErrors.emergencyName = 'Required';
    if (!form.emergencyContact) newErrors.emergencyContact = 'Required';
    if (!form.indemnity) newErrors.indemnity = 'You must accept the indemnity agreement';
    if (!form.accommodation) newErrors.accommodation = 'Required';
    if (form.accommodation === 'dorm' && !form.bedding) newErrors.bedding = 'You must confirm bedding';
    if (form.accommodation === 'daypass' && form.dayPass.length === 0) newErrors.dayPass = 'Select at least one day';
    if (!form.payment) newErrors.payment = 'Required';
    if (form.payment === 'venue' && !form.commitment) newErrors.commitment = 'You must commit to attend';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch pricing information from backend
  const fetchPricingInfo = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://backend-old-smoke-6499.fly.dev';
      const response = await fetch(`${apiUrl}/api/pricing/info`);
      const data = await response.json();
      setPricingInfo(data);
    } catch (error) {
      console.error('Error fetching pricing info:', error);
    }
  };

  // Calculate price using backend
  const calculatePriceFromBackend = async () => {
    if (!form.accommodation) {
      setCurrentPrice(0);
      return;
    }

    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'https://backend-old-smoke-6499.fly.dev';
      const response = await fetch(`${apiUrl}/api/pricing/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accommodation: form.accommodation,
          dayPass: form.dayPass,
          registrationType: form.registrationType,
          dayPassMeals: form.dayPassMeals
        })
      });
      
      const data = await response.json();
      setCurrentPrice(data.total);
    } catch (error) {
      console.error('Error calculating price:', error);
      setCurrentPrice(0);
    } finally {
      setLoading(false);
    }
  };

  // Fallback pricing calculation (immediate functionality)
  const getFallbackPrice = () => {
    if (form.accommodation === 'daypass') {
      if (form.dayPassMeals) {
        return form.dayPass.length * 230; // R230 per day with meals
      } else {
        return 0; // Free entry, no meals
      }
    }
    
    // Check if early bird period (until Feb 28, 2026)
    const now = new Date();
    const earlyBirdDeadline = new Date('2026-02-28');
    const isEarlyBird = now <= earlyBirdDeadline;
    
    if (form.accommodation === 'guesthouse') {
      return isEarlyBird ? 1650 : 1900; // Early bird or regular
    }
    
    if (form.accommodation === 'dorm') {
      if (form.registrationType === 'student') {
        return 1155; // Student price
      }
      return isEarlyBird ? 1400 : 1650; // Early bird or regular
    }
    
    return 0;
  };

  // Legacy function for backward compatibility
  const calculatePrice = () => {
    // Use backend price if available, otherwise fallback to local calculation
    return currentPrice > 0 ? currentPrice : getFallbackPrice();
  };

  // Fetch pricing info on component mount
  useEffect(() => {
    fetchPricingInfo();
  }, []);

  // Recalculate price when form changes
  useEffect(() => {
    calculatePriceFromBackend();
  }, [form.accommodation, form.dayPass, form.registrationType, form.dayPassMeals]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Submit form logic
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://backend-old-smoke-6499.fly.dev';
      const response = await fetch(`${apiUrl}/api/register/individual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        navigate('/register/confirmation', { state: { payment: form.payment, summary: form } });
      } else {
        alert('Failed to submit registration.');
      }
    } catch (error) {
      alert('Error submitting registration.');
    }
  };

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
          maxWidth: 500,
          width: '100%',
          px: { xs: 2, sm: 5 },
          py: { xs: 3, sm: 5 },
          borderRadius: 5,
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.10)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeIn 1s',
          transition: 'box-shadow 0.3s',
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
          Individual Registration
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
            
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', letterSpacing: '0.5px', mb: 2, textAlign: 'center' }}>
              Early Bird Special
            </Typography>
            
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.95)', mb: 2, lineHeight: 1.6 }}>
              Register before <strong>February 28, 2026</strong> and save big!
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#4fc3f7', fontWeight: 'bold', fontSize: '1.1rem' }}>🏨 Guesthouse</Typography>
                <Typography sx={{ color: 'white', fontSize: '0.9rem' }}>R1650 <span style={{textDecoration: 'line-through', opacity: 0.7}}>R1900</span></Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#81c784', fontWeight: 'bold', fontSize: '1.1rem' }}>🏠 Dormitory</Typography>
                <Typography sx={{ color: 'white', fontSize: '0.9rem' }}>R1400 <span style={{textDecoration: 'line-through', opacity: 0.7}}>R1650</span></Typography>
              </Box>
            </Box>
          </Box>
        )}
        
        <form onSubmit={handleSubmit} style={{ marginTop: 16, textAlign: 'left' }}>
  <TextField
    fullWidth
    label="Full Name"
    name="name"
    value={form.name}
    onChange={handleChange}
    margin="normal"
    error={!!errors.name}
    helperText={errors.name}
  />
  <FormControl component="fieldset" margin="normal" required error={!!errors.gender}>
    <FormLabel component="legend">Gender</FormLabel>
    <RadioGroup row name="gender" value={form.gender} onChange={handleChange}>
      <FormControlLabel value="Male" control={<Radio />} label="Male" />
      <FormControlLabel value="Female" control={<Radio />} label="Female" />
    </RadioGroup>
    <FormHelperText>{errors.gender}</FormHelperText>
  </FormControl>
  <TextField
    fullWidth
    label="Email"
    name="email"
    value={form.email}
    onChange={handleChange}
    margin="normal"
    error={!!errors.email}
    helperText={errors.email}
  />
  <TextField
    fullWidth
    label="Phone Number"
    name="phone"
    value={form.phone}
    onChange={handleChange}
    margin="normal"
    error={!!errors.phone}
    helperText={errors.phone}
  />
  <TextField
    fullWidth
    label="Church/Organization"
    name="church"
    value={form.church}
    onChange={handleChange}
    margin="normal"
    error={!!errors.church}
    helperText={errors.church}
  />
  <TextField
    fullWidth
    label="Country"
    name="country"
    value={form.country}
    onChange={handleChange}
    margin="normal"
    error={!!errors.country}
    helperText={errors.country}
  />
  <TextField
    fullWidth
    label="Emergency Contact Name"
    name="emergencyName"
    value={form.emergencyName}
    onChange={handleChange}
    margin="normal"
    error={!!errors.emergencyName}
    helperText={errors.emergencyName}
  />
  <TextField
    fullWidth
    label="Emergency Contact Number"
    name="emergencyContact"
    value={form.emergencyContact}
    onChange={handleChange}
    margin="normal"
    error={!!errors.emergencyContact}
    helperText={errors.emergencyContact}
  />
          <FormControlLabel
            control={<Checkbox checked={form.indemnity} name="indemnity" onChange={handleChange} />}
            label="I accept the indemnity agreement (required)"
          />
          {errors.indemnity && <FormHelperText error>{errors.indemnity}</FormHelperText>}
          
          {/* Registration Type Selection */}
          <FormControl component="fieldset" margin="normal" style={{ marginTop: 20 }}>
            <FormLabel component="legend">Registration Type</FormLabel>
            <RadioGroup
              name="registrationType"
              value={form.registrationType}
              onChange={handleChange}
            >
              <FormControlLabel 
                value="regular" 
                control={<Radio />} 
                label={`Regular Registration - ${isEarlyBirdPeriod() ? 'Early Bird Pricing Available' : 'Regular Pricing'}`}
              />
              <FormControlLabel 
                value="student" 
                control={<Radio />} 
                disabled={form.accommodation === 'guesthouse'}
                label={`Student Registration - R${pricingInfo?.prices?.dormitory?.student || 1155} ${form.accommodation === 'guesthouse' ? '(Not available for Guesthouse)' : '(Student ID required - Dormitory only)'}`}
              />
            </RadioGroup>
          </FormControl>
          
          <FormControl component="fieldset" margin="normal" error={!!errors.accommodation}>
            <FormLabel component="legend">Accommodation Option</FormLabel>
            <RadioGroup
              name="accommodation"
              value={form.accommodation}
              onChange={handleChange}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel value="guesthouse" control={<Radio />} label="Guesthouse (Premium - Bedding Included)" />
                <AccommodationTooltip type="guesthouse" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel value="dorm" control={<Radio />} label="Dormitory (Bring Own Bedding)" />
                <AccommodationTooltip type="dormitory" />
              </Box>
              <FormControlLabel value="daypass" control={<Radio />} label="Day Pass" />
            </RadioGroup>
            <FormHelperText>{errors.accommodation}</FormHelperText>
          </FormControl>
          
          {form.accommodation === 'guesthouse' && (
            <>
              <Typography color="secondary" style={{ marginBottom: 8 }}>
                Guesthouse: <b>R{calculatePrice()}.00</b> total
                <span style={{ color: '#9c27b0', marginLeft: 8 }}>(Premium - Bedding Included)</span>
                {isEarlyBirdPeriod() && (
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
                    Early Bird
                  </Box>
                )}
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
                ✓ Private room with more privacy<br/>
                ✓ Bedding and linens included<br/>
                ✓ More luxurious accommodation
              </Typography>
            </>
          )}
          
          {form.accommodation === 'dorm' && (
            <>
              <Typography color="secondary" style={{ marginBottom: 8 }}>
                Dormitory: <b>R{calculatePrice()}.00</b> total
                {form.registrationType === 'student' && (
                  <span style={{ color: '#4caf50', marginLeft: 8 }}>(Student Discount Applied!)</span>
                )}
                {form.registrationType === 'regular' && isEarlyBirdPeriod() && (
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
                    Early Bird
                  </Box>
                )}
              </Typography>
              <FormControlLabel
                control={<Checkbox checked={form.bedding} name="bedding" onChange={handleChange} />}
                label="I will bring my own bedding (required)"
              />
              {errors.bedding && <FormHelperText error>{errors.bedding}</FormHelperText>}
            </>
          )}
          {form.accommodation === 'daypass' && (
            <>
              {/* Meal Option Selection */}
              <FormControl component="fieldset" margin="normal" style={{ marginBottom: 16 }}>
                <FormLabel component="legend">Day Pass Options</FormLabel>
                <RadioGroup
                  name="dayPassMeals"
                  value={form.dayPassMeals ? 'with-meals' : 'entry-only'}
                  onChange={(e) => setForm({ ...form, dayPassMeals: e.target.value === 'with-meals' })}
                >
                  <FormControlLabel 
                    value="with-meals" 
                    control={<Radio />} 
                    label="Day Pass with Meals - R230 per day (includes lunch & supper)"
                  />
                  <FormControlLabel 
                    value="entry-only" 
                    control={<Radio />} 
                    label="Entry Only - FREE (no meals included)"
                  />
                </RadioGroup>
              </FormControl>
              
              {/* Day Selection */}
              <FormControl component="fieldset" margin="normal" error={!!errors.dayPass}>
                <FormLabel component="legend">Select Day(s)</FormLabel>
                <FormGroup row>
                  {days.map((d) => (
                    <FormControlLabel
                      key={d.value}
                      control={
                        <Checkbox
                          checked={form.dayPass.includes(d.value)}
                          onChange={handleDayChange}
                          value={d.value}
                        />
                      }
                      label={d.label}
                    />
                  ))}
                </FormGroup>
                <FormHelperText>{errors.dayPass}</FormHelperText>
                
                {/* Pricing Display */}
                {form.dayPass.length > 0 && (
                  <Typography color="secondary" style={{ marginTop: 8 }}>
                    {form.dayPassMeals ? (
                      <>
                        Total: <b>R{calculatePrice()}.00</b> ({form.dayPass.length} day{form.dayPass.length > 1 ? 's' : ''} with meals)
                        <br/>
                        <span style={{ color: '#4caf50', fontSize: '0.875rem' }}>
                          ✓ Includes lunch and supper for each selected day
                        </span>
                      </>
                    ) : (
                      <>
                        Total: <b>FREE</b> ({form.dayPass.length} day{form.dayPass.length > 1 ? 's' : ''} entry only)
                        <br/>
                        <span style={{ color: '#ff9800', fontSize: '0.875rem' }}>
                          ⚠ No meals included - you'll need to arrange your own meals
                        </span>
                      </>
                    )}
                  </Typography>
                )}
              </FormControl>
            </>
          )}
          <FormControl component="fieldset" margin="normal" error={!!errors.payment}>
            <FormLabel component="legend">Payment Option</FormLabel>
            <RadioGroup
              row
              name="payment"
              value={form.payment}
              onChange={handleChange}
            >
              <FormControlLabel value="online" control={<Radio />} label="Online Payment" />
              <FormControlLabel value="venue" control={<Radio />} label="Payment at the Venue" />
            </RadioGroup>
            <FormHelperText>{errors.payment}</FormHelperText>
            {form.payment === 'venue' && (
              <FormControlLabel
                control={<Checkbox checked={form.commitment} name="commitment" onChange={handleChange} />}
                label="I commit to attend (required)"
              />
            )}
            {form.payment === 'venue' && errors.commitment && <FormHelperText error>{errors.commitment}</FormHelperText>}
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
              fontWeight: 600,
              borderRadius: 8,
              fontSize: 18,
              padding: '14px 0',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.13)',
              '&:hover, &:focus': {
                background: 'linear-gradient(90deg, #1976d2 60%, #9c27b0 100%)',
                color: '#fff',
                boxShadow: '0 6px 18px rgba(76, 0, 130, 0.13)'
              }
            }}
          >
            Submit Registration
          </Button>
        </form>
      </Paper>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}
