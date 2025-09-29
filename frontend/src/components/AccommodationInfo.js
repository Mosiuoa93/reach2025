import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import {
  Hotel,
  Home,
  Cabin,
  CheckCircle,
  Info,
  Star,
  Group,
  Bed,
  Shower,
  Security,
  LocalParking,
  Nature,
  Lock,
  Warning,
  Male,
  Female
} from '@mui/icons-material';

export default function AccommodationInfo() {
  const accommodations = [
    {
      id: 'dormitory',
      title: 'Dormitories',
      icon: <Home sx={{ fontSize: 40, color: '#2196f3' }} />,
      subtitle: 'Community Living Experience',
      description: 'Open-style accommodation perfect for fellowship and community building. Affordable option with shared facilities.',
      features: [
        { icon: <Bed />, text: 'Open style rooms with bunk beds in various configurations' },
        { icon: <Shower />, text: 'Shared bathroom facilities in each dormitory' },
        { icon: <Group />, text: 'Community atmosphere with fellow attendees' },
        { icon: <Male />, text: 'Separate dormitories for male and female' },
        { icon: <Security />, text: 'Safe and supervised environment' }
      ],
      important: [
        { icon: <Warning />, text: 'No bedding included - bring your own', color: '#ff9800' },
        { icon: <Shower />, text: 'Shared bathroom facilities', color: '#2196f3' }
      ],
      includes: ['Bunk bed space', 'Shared bathroom access', 'Safe storage areas'],
      notIncluded: ['Bedding (sheets, pillows, blankets)', 'Towels', 'Personal toiletries'],
      pricing: {
        regular: 'R1650',
        earlyBird: 'R1400',
        student: 'R1155',
        savings: 'Save R250 (Early Bird)'
      },
      bestFor: ['Budget-conscious attendees', 'Young adults and students', 'Those enjoying community living', 'Fellowship seekers'],
      color: '#2196f3',
      gradient: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)'
    },
    {
      id: 'couples-cabins',
      title: 'Couples Cabins',
      icon: <Cabin sx={{ fontSize: 40, color: '#4caf50' }} />,
      subtitle: 'Lakeside Retreat for Couples',
      description: 'Charming wooden cabins nestled by the lake, offering couples a peaceful and romantic setting for their stay.',
      features: [
        { icon: <Nature />, text: 'Wooden cabins situated at the beautiful lake' },
        { icon: <Bed />, text: '2 single beds in each private cabin room' },
        { icon: <CheckCircle />, text: 'All bedding included for convenience' },
        { icon: <Shower />, text: 'Access to external ablution blocks' },
        { icon: <Nature />, text: 'Scenic lake views and natural surroundings' }
      ],
      important: [
        { icon: <CheckCircle />, text: 'Bedding included - no need to bring your own', color: '#4caf50' },
        { icon: <Info />, text: 'External ablution blocks (short walk)', color: '#2196f3' }
      ],
      includes: ['2 single beds', 'All bedding (sheets, pillows, blankets)', 'Lakeside location', 'Private cabin space'],
      notIncluded: ['En-suite bathroom', 'Towels', 'Personal toiletries'],
      pricing: {
        coupleBase: 'R3500',
        earlyBird: 'R3000',
        children: 'R1155 per child',
        savings: 'Save R500 (Early Bird)'
      },
      bestFor: ['Married couples', 'Families with children', 'Nature lovers', 'Those seeking tranquility'],
      color: '#4caf50',
      gradient: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)'
    },
    {
      id: 'guesthouse',
      title: 'Guesthouses',
      icon: <Hotel sx={{ fontSize: 40, color: '#9c27b0' }} />,
      subtitle: 'Comfortable House-Style Accommodation',
      description: 'Large houses offering various room configurations, from private lockable rooms to open-plan spaces, all with shared facilities.',
      features: [
        { icon: <Hotel />, text: 'Large houses with multiple room options' },
        { icon: <Lock />, text: 'Some rooms with lockable doors for privacy' },
        { icon: <Bed />, text: 'Rooms with 2 single beds (lockable and open-plan)' },
        { icon: <Shower />, text: 'Shared bathroom facilities within each guesthouse' },
        { icon: <CheckCircle />, text: 'All bedding provided for comfort' }
      ],
      important: [
        { icon: <CheckCircle />, text: 'Bedding included - fully equipped', color: '#4caf50' },
        { icon: <Info />, text: 'Mix of lockable and open-plan rooms available', color: '#2196f3' }
      ],
      includes: ['2 single beds per room', 'All bedding (sheets, pillows, blankets)', 'Shared bathroom access', 'House-style living'],
      notIncluded: ['Private bathroom', 'Towels', 'Personal toiletries'],
      pricing: {
        regular: 'R1900',
        earlyBird: 'R1650',
        savings: 'Save R250 (Early Bird)',
        note: 'No student discount available'
      },
      bestFor: ['Those wanting more privacy', 'Couples preferring house-style living', 'Leaders and speakers', 'Mixed groups'],
      color: '#9c27b0',
      gradient: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)'
    }
  ];

  const renderFeatureList = (features, important = []) => (
    <Box>
      <List dense>
        {features.map((feature, index) => (
          <ListItem key={index} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {React.cloneElement(feature.icon, { sx: { fontSize: 20, color: 'primary.main' } })}
            </ListItemIcon>
            <ListItemText 
              primary={feature.text} 
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        ))}
      </List>
      
      {important.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {important.map((item, index) => (
            <Alert 
              key={index} 
              severity="info" 
              icon={item.icon}
              sx={{ 
                mb: 1, 
                '& .MuiAlert-icon': { color: item.color },
                '& .MuiAlert-message': { fontSize: '0.875rem' }
              }}
            >
              {item.text}
            </Alert>
          ))}
        </Box>
      )}
    </Box>
  );

  const renderPricingInfo = (pricing, color) => (
    <Box sx={{ 
      background: `linear-gradient(135deg, ${color}15, ${color}05)`,
      borderRadius: 2,
      p: 2,
      mt: 2
    }}>
      <Typography variant="h6" sx={{ color: color, fontWeight: 'bold', mb: 1 }}>
        Pricing Information
      </Typography>
      
      {pricing.regular && (
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Regular:</strong> {pricing.regular}
        </Typography>
      )}
      
      {pricing.earlyBird && (
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Early Bird:</strong> {pricing.earlyBird}
        </Typography>
      )}
      
      {pricing.student && (
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Student Rate:</strong> {pricing.student}
        </Typography>
      )}
      
      {pricing.coupleBase && (
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Couple Base:</strong> {pricing.coupleBase}
        </Typography>
      )}
      
      {pricing.children && (
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>Children:</strong> {pricing.children}
        </Typography>
      )}
      
      {pricing.savings && (
        <Chip 
          label={pricing.savings} 
          size="small" 
          sx={{ 
            backgroundColor: '#4caf50', 
            color: 'white', 
            fontWeight: 'bold',
            mt: 1
          }} 
        />
      )}
      
      {pricing.note && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
          {pricing.note}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Accommodation Options
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Choose the perfect stay for your REACH2025 experience
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We offer three distinct accommodation types to suit different preferences and budgets
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {accommodations.map((accommodation) => (
          <Grid item xs={12} md={4} key={accommodation.id}>
            <Card 
              elevation={4}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease'
                }
              }}
            >
              {/* Header with gradient */}
              <Box
                sx={{
                  background: accommodation.gradient,
                  color: 'white',
                  p: 3,
                  textAlign: 'center',
                  position: 'relative'
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {accommodation.icon}
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {accommodation.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  {accommodation.subtitle}
                </Typography>
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {accommodation.description}
                </Typography>

                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                  Features & Facilities
                </Typography>
                {renderFeatureList(accommodation.features, accommodation.important)}

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  What's Included
                </Typography>
                <List dense>
                  {accommodation.includes.map((item, index) => (
                    <ListItem key={index} sx={{ py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item} 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>

                {accommodation.notIncluded && (
                  <>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                      Not Included
                    </Typography>
                    <List dense>
                      {accommodation.notIncluded.map((item, index) => (
                        <ListItem key={index} sx={{ py: 0.25 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <Warning sx={{ fontSize: 16, color: '#ff9800' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={item} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                {renderPricingInfo(accommodation.pricing, accommodation.color)}

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Best For
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {accommodation.bestFor.map((item, index) => (
                      <Chip 
                        key={index}
                        label={item} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          borderColor: accommodation.color,
                          color: accommodation.color,
                          '&:hover': {
                            backgroundColor: `${accommodation.color}10`
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Additional Information */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Important:</strong> All accommodation bookings are subject to availability. 
            Early bird pricing available until February 28, 2026. 
            Please bring your own towels and personal toiletries for all accommodation types.
          </Typography>
        </Alert>
        
        <Typography variant="body2" color="text.secondary">
          Need help choosing? Our registration team can help you select the best accommodation 
          option based on your preferences and budget.
        </Typography>
      </Box>
    </Box>
  );
}
