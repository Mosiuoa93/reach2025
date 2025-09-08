import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

const EditDialog = ({ open, onClose, onSave, data, type }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleMemberChange = (index, field, value) => {
    const members = Array.isArray(formData.members) ? formData.members : 
      (typeof formData.members === 'string' ? JSON.parse(formData.members) : []);
    
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    
    setFormData(prev => ({
      ...prev,
      members: JSON.stringify(updatedMembers)
    }));
  };

  const addMember = () => {
    const members = Array.isArray(formData.members) ? formData.members : 
      (typeof formData.members === 'string' ? JSON.parse(formData.members) : []);
    
    const newMembers = [...members, { name: '', gender: 'Male', email: '', phone: '' }];
    setFormData(prev => ({
      ...prev,
      members: JSON.stringify(newMembers)
    }));
  };

  const removeMember = (index) => {
    const members = Array.isArray(formData.members) ? formData.members : 
      (typeof formData.members === 'string' ? JSON.parse(formData.members) : []);
    
    const newMembers = members.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      members: JSON.stringify(newMembers)
    }));
  };

  if (!data) return null;

  const members = type === 'group' && formData.members ? 
    (Array.isArray(formData.members) ? formData.members : 
     (typeof formData.members === 'string' ? JSON.parse(formData.members) : [])) : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit {type === 'individual' ? 'Individual' : type === 'couple' ? 'Couple' : 'Group'} Registration
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {type === 'individual' ? (
            <>
              <TextField
                label="Name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                fullWidth
              />
              <TextField
                label="Email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                fullWidth
              />
              <TextField
                label="Phone"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender || ''}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Church"
                value={formData.church || ''}
                onChange={(e) => handleChange('church', e.target.value)}
                fullWidth
              />
              <TextField
                label="Country"
                value={formData.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Accommodation</InputLabel>
                <Select
                  value={formData.accommodation || ''}
                  onChange={(e) => handleChange('accommodation', e.target.value)}
                  label="Accommodation"
                >
                  <MenuItem value="dorm">Dormitory</MenuItem>
                  <MenuItem value="daypass">Day Pass</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.payment || ''}
                  onChange={(e) => handleChange('payment', e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="venue">At Venue</MenuItem>
                  <MenuItem value="eft">EFT</MenuItem>
                  <MenuItem value="paynow">PayNow</MenuItem>
                </Select>
              </FormControl>
            </>
          ) : type === 'couple' ? (
            <>
              {/* Partner 1 Fields */}
              <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'primary.main' }}>
                Partner 1
              </Typography>
              <TextField
                label="Partner 1 Name"
                value={formData.partner1_name || ''}
                onChange={(e) => handleChange('partner1_name', e.target.value)}
                fullWidth
              />
              <TextField
                label="Partner 1 Email"
                value={formData.partner1_email || ''}
                onChange={(e) => handleChange('partner1_email', e.target.value)}
                fullWidth
              />
              <TextField
                label="Partner 1 Phone"
                value={formData.partner1_phone || ''}
                onChange={(e) => handleChange('partner1_phone', e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Partner 1 Gender</InputLabel>
                <Select
                  value={formData.partner1_gender || ''}
                  onChange={(e) => handleChange('partner1_gender', e.target.value)}
                  label="Partner 1 Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>

              {/* Partner 2 Fields */}
              <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'primary.main' }}>
                Partner 2
              </Typography>
              <TextField
                label="Partner 2 Name"
                value={formData.partner2_name || ''}
                onChange={(e) => handleChange('partner2_name', e.target.value)}
                fullWidth
              />
              <TextField
                label="Partner 2 Email"
                value={formData.partner2_email || ''}
                onChange={(e) => handleChange('partner2_email', e.target.value)}
                fullWidth
              />
              <TextField
                label="Partner 2 Phone"
                value={formData.partner2_phone || ''}
                onChange={(e) => handleChange('partner2_phone', e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Partner 2 Gender</InputLabel>
                <Select
                  value={formData.partner2_gender || ''}
                  onChange={(e) => handleChange('partner2_gender', e.target.value)}
                  label="Partner 2 Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>

              {/* Shared Fields */}
              <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'primary.main' }}>
                Shared Information
              </Typography>
              <TextField
                label="Church"
                value={formData.church || ''}
                onChange={(e) => handleChange('church', e.target.value)}
                fullWidth
              />
              <TextField
                label="Country"
                value={formData.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Accommodation</InputLabel>
                <Select
                  value={formData.accommodation || ''}
                  onChange={(e) => handleChange('accommodation', e.target.value)}
                  label="Accommodation"
                >
                  <MenuItem value="couple">Couple Accommodation</MenuItem>
                  <MenuItem value="dorm">Dormitory</MenuItem>
                  <MenuItem value="daypass">Day Pass</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.payment_method || ''}
                  onChange={(e) => handleChange('payment_method', e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="venue">At Venue</MenuItem>
                  <MenuItem value="eft">EFT</MenuItem>
                  <MenuItem value="paynow">PayNow</MenuItem>
                </Select>
              </FormControl>

              {/* Children Information */}
              {formData.children_count > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'primary.main' }}>
                    Children ({formData.children_count})
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {(() => {
                        try {
                          const children = typeof formData.children === 'string' 
                            ? JSON.parse(formData.children) 
                            : formData.children || [];
                          return children.map((child, index) => 
                            `${index + 1}. ${child.name} (${child.age}, ${child.gender})`
                          ).join(', ');
                        } catch {
                          return 'Children data available';
                        }
                      })()} 
                    </Typography>
                  </Box>
                </>
              )}
            </>
          ) : (
            <>
              <TextField
                label="Group Name"
                value={formData.group_name || ''}
                onChange={(e) => handleChange('group_name', e.target.value)}
                fullWidth
              />
              <TextField
                label="Leader Name"
                value={formData.leader_name || ''}
                onChange={(e) => handleChange('leader_name', e.target.value)}
                fullWidth
              />
              <TextField
                label="Leader Email"
                value={formData.leader_email || ''}
                onChange={(e) => handleChange('leader_email', e.target.value)}
                fullWidth
              />
              <TextField
                label="Leader Phone"
                value={formData.leader_phone || ''}
                onChange={(e) => handleChange('leader_phone', e.target.value)}
                fullWidth
              />
              <TextField
                label="Leader Church"
                value={formData.leader_church || ''}
                onChange={(e) => handleChange('leader_church', e.target.value)}
                fullWidth
              />
              <TextField
                label="Leader Country"
                value={formData.leader_country || ''}
                onChange={(e) => handleChange('leader_country', e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Accommodation</InputLabel>
                <Select
                  value={formData.accommodation || ''}
                  onChange={(e) => handleChange('accommodation', e.target.value)}
                  label="Accommodation"
                >
                  <MenuItem value="dorm">Dormitory</MenuItem>
                  <MenuItem value="daypass">Day Pass</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.payment || ''}
                  onChange={(e) => handleChange('payment', e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="venue">At Venue</MenuItem>
                  <MenuItem value="eft">EFT</MenuItem>
                  <MenuItem value="paynow">PayNow</MenuItem>
                </Select>
              </FormControl>

              {/* Group Members Section */}
              <Box sx={{ mt: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">Group Members ({members.length})</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addMember}
                    variant="outlined"
                    size="small"
                  >
                    Add Member
                  </Button>
                </Box>
                
                {members.map((member, index) => (
                  <Box key={index} sx={{ 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 2, 
                    p: 2, 
                    mb: 2,
                    position: 'relative'
                  }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeMember(index)}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                      Member {index + 1}
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <TextField
                        label="Name"
                        value={member.name || ''}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        size="small"
                      />
                      <FormControl size="small">
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={member.gender || 'Male'}
                          onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}
                          label="Gender"
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Email"
                        value={member.email || ''}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                        size="small"
                      />
                      <TextField
                        label="Phone"
                        value={member.phone || ''}
                        onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                        size="small"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
