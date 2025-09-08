import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const EditDeleteButtons = ({ onEdit, onDelete, editTooltip = "Edit", deleteTooltip = "Delete" }) => {
  return (
    <Box display="flex" gap={1}>
      <Tooltip title={editTooltip}>
        <IconButton 
          size="small" 
          color="primary" 
          onClick={onEdit}
          sx={{ 
            '&:hover': { 
              bgcolor: 'primary.main', 
              color: 'white' 
            } 
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={deleteTooltip}>
        <IconButton 
          size="small" 
          color="error" 
          onClick={onDelete}
          sx={{ 
            '&:hover': { 
              bgcolor: 'error.main', 
              color: 'white' 
            } 
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default EditDeleteButtons;
