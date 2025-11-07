import React, { useState } from 'react';
import { Typography, TextField, FormControlLabel, Checkbox, Button, Radio, RadioGroup, FormControl, FormLabel, FormGroup, FormHelperText, IconButton, Paper, Box, Container, Alert, Card, CardContent, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const days = [
  { label: 'Day 1', value: 'day1' },
  { label: 'Day 2', value: 'day2' },
  { label: 'Day 3', value: 'day3' }
];

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
    payment: '',
    commitment: false,
    isStudent: false,
  });
  const [errors, setErrors] = useState({});

  // Early bird pricing
  const isEarlyBirdPeriod = () => {
    const now = new Date();
    const earlyBirdDeadline = new Date('2026-02-28');
    return now <= earlyBirdDeadline;
  };

  const getPricing = () => {
    const isEarlyBird = isEarlyBirdPeriod();
    
    return {
      dorm: isEarlyBird ? 1400 : 1650,        // R1650 - R250 early bird = R1400
      guesthouse: isEarlyBird ? 1650 : 1900,  // R1900 - R250 early bird = R1650
      student: 1155,                           // Student price (already discounted)
      baseDorm: 1650,
      baseGuesthouse: 1900,
      isEarlyBird,
      earlyBirdDiscount: 250
    };
  };

  const pricing = getPricing();

  const calculateTotal = () => {
    if (form.isStudent && form.accommodation === 'dorm') {
      return pricing.student;  // R1155 for students
    } else if (form.accommodation === 'dorm') {
      return pricing.dorm;
    } else if (form.accommodation === 'guesthouse') {
      return pricing.guesthouse;
    }
    return 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Submit form logic
    try {
      const response = await fetch('https://backend-old-smoke-6499.fly.dev/api/register/individual', {
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
        <Typography variant="h6" color="secondary" gutterBottom>
          REACH2026 Leader's Summit
        </Typography>

        {/* Early Bird Banner */}
        {pricing.isEarlyBird && (
          <Box 
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              p: 2,
              mb: 3,
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
              💎 Early Bird Special - Save R250!
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', mt: 0.5 }}>
              Dorm: R{pricing.dorm} (was R{pricing.baseDorm}) | Guest House: R{pricing.guesthouse} (was R{pricing.baseGuesthouse})
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', mt: 0.5 }}>
              Register before February 28, 2026
            </Typography>
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
          {/* Student Discount Option */}
          <FormControlLabel
            control={<Checkbox checked={form.isStudent} name="isStudent" onChange={handleChange} />}
            label="I am a student (30% discount on dorm only)"
            sx={{ mb: 2 }}
          />

          <FormControl component="fieldset" margin="normal" required error={!!errors.accommodation}>
            <FormLabel component="legend">Accommodation Option</FormLabel>
            <RadioGroup
              name="accommodation"
              value={form.accommodation}
              onChange={handleChange}
            >
              <FormControlLabel value="dorm" control={<Radio />} label="Dormitory" />
              <FormControlLabel 
                value="guesthouse" 
                control={<Radio />} 
                label="Guest House"
                disabled={form.isStudent}
              />
            </RadioGroup>
            {form.isStudent && <FormHelperText>Students can only select Dormitory</FormHelperText>}
            <FormHelperText>{errors.accommodation}</FormHelperText>
          </FormControl>

          {form.accommodation === 'dorm' && (
            <>
              <Card sx={{ mb: 2, bgcolor: '#f0f7ff', border: '1px solid #e3f2fd' }}>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography color="primary" style={{ marginBottom: 8 }}>
                    Dormitory: <b>R{calculateTotal()}</b>
                    {pricing.isEarlyBird && <span style={{ color: '#9c27b0', fontSize: '0.85rem', marginLeft: 8 }}>(Save R{pricing.earlyBirdDiscount}: was R{pricing.baseDorm})</span>}
                    {form.isStudent && <span style={{ color: '#ff6f00', fontSize: '0.85rem', marginLeft: 8 }}>Student Price</span>}
                  </Typography>
                </CardContent>
              </Card>
              <FormControlLabel
                control={<Checkbox checked={form.bedding} name="bedding" onChange={handleChange} />}
                label="I will bring my own bedding (required)"
              />
              {errors.bedding && <FormHelperText error>{errors.bedding}</FormHelperText>}
            </>
          )}

          {form.accommodation === 'guesthouse' && (
            <>
              <Card sx={{ mb: 2, bgcolor: '#fff3e0', border: '1px solid #ffe0b2' }}>
                <CardContent sx={{ py: 1.5 }}>
                  <Typography color="primary" style={{ marginBottom: 8 }}>
                    Guest House: <b>R{pricing.guesthouse}</b>
                    {pricing.isEarlyBird && <span style={{ color: '#9c27b0', fontSize: '0.85rem', marginLeft: 8 }}>(Save R{pricing.earlyBirdDiscount}: was R{pricing.baseGuesthouse})</span>}
                  </Typography>
                  <Typography variant="body2" color="warning.main" sx={{ mt: 1, fontSize: '0.8rem' }}>
                    ⚠️ Limited to 120 spaces - availability checked during registration
                  </Typography>
                </CardContent>
              </Card>
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
            {form.accommodation ? `Register - R${calculateTotal()}` : 'Submit Registration'}
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
