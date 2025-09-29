import React from 'react';
import { Tooltip, IconButton, Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Info, CheckCircle, Warning, Bed, Shower, Group, Lock, Nature } from '@mui/icons-material';

const AccommodationTooltip = ({ type }) => {
  const accommodationInfo = {
    dormitory: {
      title: 'Dormitories',
      description: 'Open-style rooms with bunk beds in various configurations',
      features: [
        'Shared bathroom in each dormitory',
        'Separate dormitories for male and female',
        'No bedding included - bring your own',
        'Community living experience'
      ],
      icon: <Bed sx={{ fontSize: 16, color: '#2196f3' }} />
    },
    guesthouse: {
      title: 'Guesthouses', 
      description: 'Large houses with various room configurations',
      features: [
        'Some rooms with lockable doors, others open-plan',
        '2 single beds per room',
        'Shared bathroom in guesthouse',
        'Bedding included'
      ],
      icon: <Lock sx={{ fontSize: 16, color: '#9c27b0' }} />
    },
    couple: {
      title: 'Couples Cabins',
      description: 'Wooden cabins at the lake with scenic views',
      features: [
        '2 single beds in private cabin room',
        'Bedding included',
        'Access to external ablution blocks',
        'Beautiful lakeside location'
      ],
      icon: <Nature sx={{ fontSize: 16, color: '#4caf50' }} />
    }
  };

  const info = accommodationInfo[type];
  if (!info) return null;

  const tooltipContent = (
    <Box sx={{ maxWidth: 300 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'white' }}>
        {info.title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1.5, color: 'rgba(255,255,255,0.9)' }}>
        {info.description}
      </Typography>
      <List dense sx={{ py: 0 }}>
        {info.features.map((feature, index) => (
          <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
            <ListItemIcon sx={{ minWidth: 20 }}>
              {feature.includes('No bedding') || feature.includes('external ablution') ? 
                <Warning sx={{ fontSize: 14, color: '#ffb74d' }} /> :
                <CheckCircle sx={{ fontSize: 14, color: '#81c784' }} />
              }
            </ListItemIcon>
            <ListItemText 
              primary={feature}
              primaryTypographyProps={{ 
                variant: 'caption', 
                sx: { color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 } 
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Tooltip 
      title={tooltipContent}
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            maxWidth: 350,
            fontSize: '0.75rem',
            '& .MuiTooltip-arrow': {
              color: 'rgba(0, 0, 0, 0.9)',
            },
          },
        },
      }}
    >
      <IconButton 
        size="small" 
        sx={{ 
          ml: 1, 
          color: 'action.active',
          '&:hover': {
            color: 'primary.main',
            backgroundColor: 'action.hover'
          }
        }}
      >
        <Info sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  );
};

export default AccommodationTooltip;
