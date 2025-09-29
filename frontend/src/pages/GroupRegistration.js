import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, IconButton, Paper, Grid, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const initialMember = { name: '', gender: '', email: '', phone: '' };

export default function GroupRegistration() {
  const navigate = useNavigate();
  const [leader, setLeader] = useState({ name: '', gender: '', email: '', phone: '', church: '', country: '' });
  const [members, setMembers] = useState([{ ...initialMember }]);
  const [accommodation, setAccommodation] = useState('dorm');
  const [payment, setPayment] = useState('paynow');
  const [errors, setErrors] = useState({});
  const [pricing, setPricing] = useState({
    totalPeople: 1,
    basePrice: 1400,
    subtotal: 1400,
    discountPercentage: 0,
    discount: 0,
    total: 1400,
    isEarlyBird: true
  });
  const [loading, setLoading] = useState(false);

  // Fallback early bird detection
  const isEarlyBirdPeriod = () => {
    const now = new Date();
    const earlyBirdDeadline = new Date('2026-02-28');
    return now <= earlyBirdDeadline;
  };

  // Calculate group pricing from backend
  const calculateGroupPricing = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/pricing/calculate-group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ members })
      });
      
      const data = await response.json();
      setPricing(data);
    } catch (error) {
      console.error('Error calculating group price:', error);
      // Fallback calculation
      const totalPeople = 1 + members.length;
      const basePrice = isEarlyBirdPeriod() ? 1400 : 1650;
      const subtotal = totalPeople * basePrice;
      let discountPercentage = 0;
      let discount = 0;
      
      if (totalPeople >= 21) {
        discountPercentage = 20;
        discount = subtotal * 0.20;
      } else if (totalPeople >= 11) {
        discountPercentage = 10;
        discount = subtotal * 0.10;
      }
      
      setPricing({
        totalPeople,
        basePrice,
        subtotal,
        discountPercentage,
        discount,
        total: subtotal - discount,
        isEarlyBird: isEarlyBirdPeriod()
      });
    } finally {
      setLoading(false);
    }
  };

  // Recalculate pricing when members change
  useEffect(() => {
    calculateGroupPricing();
  }, [members.length]);

  const handleLeaderChange = (e) => {
    setLeader({ ...leader, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (idx, e) => {
    const updated = [...members];
    updated[idx][e.target.name] = e.target.value;
    setMembers(updated);
  };

  const addMember = () => setMembers([...members, { ...initialMember }]);
  const removeMember = (idx) => setMembers(members.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation (expand as needed)
    if (!leader.name || !leader.email) {
      setErrors({ leader: 'Leader name and email required' });
      return;
    }
    if (members.some(m => !m.name || !m.email)) {
      setErrors({ members: 'All members need name and email' });
      return;
    }
    setErrors({});
    // Submit to backend
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/register/group`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          leader, 
          members, 
          accommodation, 
          payment,
          // Pricing is now calculated in backend
        }),
      });
      if (response.ok) {
        navigate('/register/confirmation', { 
          state: { 
            payment, 
            summary: { 
              leader, 
              members, 
              accommodation, 
              payment, 
              total: pricing.total, 
              discount: pricing.discount,
              totalPeople: pricing.totalPeople,
              discountPercentage: pricing.discountPercentage
            } 
          } 
        });
      } else {
        alert('Failed to submit group registration.');
      }
    } catch (err) {
      alert('Error submitting group registration.');
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
          maxWidth: 600,
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
          Group Registration
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
                <Typography sx={{ fontSize: '2rem' }}>🚀</Typography>
              </Box>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                Early Bird Group Special
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.95)', mb: 2, lineHeight: 1.6 }}>
              Register before <strong>February 28, 2026</strong> and save R250 per person!
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#4fc3f7', fontWeight: 'bold', fontSize: '1.1rem' }}>👥 Per Person</Typography>
                <Typography sx={{ color: 'white', fontSize: '0.9rem' }}>R1400 <span style={{textDecoration: 'line-through', opacity: 0.7}}>R1650</span></Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#ffb74d', fontWeight: 'bold', fontSize: '1.1rem' }}>🎆 Group Discounts</Typography>
                <Typography sx={{ color: 'white', fontSize: '0.9rem' }}>10% (11+) • 20% (21+)</Typography>
              </Box>
            </Box>
          </Box>
        )}
        
        <form onSubmit={handleSubmit} style={{ marginTop: 16, textAlign: 'left' }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Group Leader Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField label="Full Name" name="name" value={leader.name} onChange={handleLeaderChange} fullWidth required /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <FormLabel>Gender</FormLabel>
                <RadioGroup row name="gender" value={leader.gender} onChange={handleLeaderChange}>
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}><TextField label="Email" name="email" value={leader.email} onChange={handleLeaderChange} fullWidth required /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Phone" name="phone" value={leader.phone} onChange={handleLeaderChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Church/Organization" name="church" value={leader.church} onChange={handleLeaderChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Country" name="country" value={leader.country} onChange={handleLeaderChange} fullWidth /></Grid>
          </Grid>
        </Paper>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Group Members</Typography>
          {errors.members && <Typography color="error">{errors.members}</Typography>}
          {members.map((member, idx) => (
  <Box key={idx} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, mb: 2 }}>
    <TextField label="Name" name="name" value={member.name} onChange={e => handleMemberChange(idx, e)} fullWidth required sx={{ mb: 2 }} />
    <TextField label="Email" name="email" value={member.email} onChange={e => handleMemberChange(idx, e)} fullWidth required sx={{ mb: 2 }} />
    <TextField label="Phone Number" name="phone" value={member.phone} onChange={e => handleMemberChange(idx, e)} fullWidth required sx={{ mb: 2 }} />
    <FormControl component="fieldset" margin="normal" required sx={{ mb: 2 }}>
      <FormLabel component="legend">Gender</FormLabel>
      <RadioGroup row name="gender" value={member.gender} onChange={e => handleMemberChange(idx, e)}>
        <FormControlLabel value="Male" control={<Radio />} label="Male" />
        <FormControlLabel value="Female" control={<Radio />} label="Female" />
      </RadioGroup>
    </FormControl>
    <Button onClick={() => removeMember(idx)} color="error" disabled={members.length === 1} sx={{ mt: 1 }}>
      Remove
    </Button>
  </Box>
))}
          <Button onClick={addMember} style={{ marginTop: 8 }} variant="outlined">Add Member</Button>
        </Paper>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Accommodation</Typography>
          <Button variant={accommodation==='dorm'?'contained':'outlined'} onClick={() => setAccommodation('dorm')}>Dormitory (R1300/member)</Button>
          <Button variant={accommodation==='daypass'?'contained':'outlined'} onClick={() => setAccommodation('daypass')} style={{ marginLeft: 8 }}>Day Pass (R250/day/member)</Button>
        </Paper>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Payment Option</Typography>
          <Button variant={payment==='paynow'?'contained':'outlined'} onClick={() => setPayment('paynow')}>Pay Now</Button>
          <Button variant={payment==='venue'?'contained':'outlined'} onClick={() => setPayment('venue')} style={{ marginLeft: 8 }}>Pay at Venue</Button>
        </Paper>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Group Pricing Summary
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
                🚀 Early Bird
              </Box>
            )}
          </Typography>
          
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Total People: {pricing.totalPeople} (1 leader + {members.length} members)
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            Base Price: R{pricing.basePrice} per person
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            Subtotal: R{pricing.subtotal.toFixed(2)}
          </Typography>
          
          {pricing.discountPercentage > 0 && (
            <Typography color="primary" variant="body1" gutterBottom>
              Group Discount ({pricing.discountPercentage}%): -R{pricing.discount.toFixed(2)}
              {pricing.discountPercentage === 10 && (
                <span style={{ fontSize: '0.75rem', display: 'block' }}>Groups of 11+ people</span>
              )}
              {pricing.discountPercentage === 20 && (
                <span style={{ fontSize: '0.75rem', display: 'block' }}>Groups of 21+ people</span>
              )}
            </Typography>
          )}
          
          {pricing.discountPercentage === 0 && pricing.totalPeople >= 8 && (
            <Typography color="textSecondary" variant="body2" gutterBottom>
              💡 Add {11 - pricing.totalPeople} more people for 10% group discount!
            </Typography>
          )}
          
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mt: 1 }}>
            Total: R{pricing.total.toFixed(2)}
          </Typography>
          
          {loading && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Calculating pricing...
            </Typography>
          )}
        </Paper>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{
            mt: 2,
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
          Submit Group Registration
        </Button>
        {errors.leader && <Typography color="error">{errors.leader}</Typography>}
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
