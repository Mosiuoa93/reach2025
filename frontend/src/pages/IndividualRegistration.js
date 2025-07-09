import React, { useState } from 'react';
import { Typography, TextField, FormControlLabel, Checkbox, Button, Radio, RadioGroup, FormControl, FormLabel, FormGroup, FormHelperText, IconButton, Paper, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  });
  const [errors, setErrors] = useState({});

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
      const response = await fetch('http://localhost:5001/api/register/individual', {
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
        <FormControl component="fieldset" margin="normal" error={!!errors.accommodation}>
          <FormLabel component="legend">Accommodation Option</FormLabel>
          <RadioGroup
            row
            name="accommodation"
            value={form.accommodation}
            onChange={handleChange}
          >
            <FormControlLabel value="dorm" control={<Radio />} label="Dormitory" />
            <FormControlLabel value="daypass" control={<Radio />} label="Day Pass" />
          </RadioGroup>
          <FormHelperText>{errors.accommodation}</FormHelperText>
        </FormControl>
        {form.accommodation === 'dorm' && (
          <>
            <Typography color="secondary" style={{ marginBottom: 8 }}>
              Dormitory: <b>R1300-00</b> total
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={form.bedding} name="bedding" onChange={handleChange} />}
              label="I will bring my own bedding (required)"
            />
          </>
        )}
        {form.accommodation === 'dorm' && errors.bedding && <FormHelperText error>{errors.bedding}</FormHelperText>}
        {form.accommodation === 'daypass' && (
          <FormControl component="fieldset" margin="normal" error={!!errors.dayPass}>
            <FormLabel component="legend">Select Day(s) <span style={{ color: '#1976d2' }}>(R250-00 per day)</span></FormLabel>
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
          </FormControl>
        )}
        <FormControl component="fieldset" margin="normal" error={!!errors.payment}>
          <FormLabel component="legend">Payment Option</FormLabel>
          <RadioGroup
            row
            name="payment"
            value={form.payment}
            onChange={handleChange}
          >
            <FormControlLabel value="now" control={<Radio />} label="Pay Now" />
            <FormControlLabel value="venue" control={<Radio />} label="Pay at Venue" />
          </RadioGroup>
          <FormHelperText>{errors.payment}</FormHelperText>
        </FormControl>
        {form.payment === 'venue' && (
          <FormControlLabel
            control={<Checkbox checked={form.commitment} name="commitment" onChange={handleChange} />}
            label="I commit to attend (required)"
          />
        )}
        {form.payment === 'venue' && errors.commitment && <FormHelperText error>{errors.commitment}</FormHelperText>}
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
