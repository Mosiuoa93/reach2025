import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const DeleteDialog = ({ open, onClose, onConfirm, type, name }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="error" />
          <span>Confirm Deletion</span>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone. The registration will be permanently deleted.
        </Alert>
        <Typography variant="body1">
          Are you sure you want to delete the {type === 'individual' ? 'individual' : 'group'} registration 
          {name ? ` for "${name}"` : ''}?
        </Typography>
        {type === 'group' && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This will also delete all associated group member data.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error"
          startIcon={<WarningIcon />}
        >
          Delete Registration
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
