require('dotenv').config({ path: '.env.development' });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

console.log('Starting backend server...');
console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'Present' : 'Not present');

// Load environment variables
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET
};

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_KEY', 'ADMIN_PASSWORD', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV === 'production') {
      if (origin === 'https://reach2025.org.za' || origin === 'https://www.reach2025.org.za' || origin === 'https://backend-old-smoke-6499.fly.dev') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Allow localhost in development
      if (origin === 'http://localhost:3000') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    console.log('Health check requested');
    // Test database connection
    const { data, error } = await supabase
      .from('individual_registrations')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Health check database error:', error);
      throw error;
    }
    
    console.log('Health check successful');
    res.status(200).json({ 
      status: 'healthy', 
      database: 'connected',
      data: data 
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy', 
      error: 'Database connection failed',
      details: error.message 
    });
  }
});

// Individual registration endpoint
app.post('/api/register/individual', async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'church', 'country', 'indemnity', 'payment', 'commitment'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(req.body.phone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const data = req.body;
    const { error } = await supabase
      .from('individual_registrations')
      .insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          church: data.church,
          country: data.country,
          emergencyName: data.emergencyName,
          emergencyContact: data.emergencyContact,
          indemnity: data.indemnity,
          accommodation: data.accommodation,
          bedding: data.bedding,
          dayPass: data.dayPass,
          payment: data.payment,
          commitment: data.commitment
        }
      ]);

    if (error) throw error;
    
    console.log('Individual registration successful:', data.email);
    res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ 
      error: 'Registration failed', 
      details: error.message 
    });
  }
});

// Get all individual registrations
app.get('/api/registrations/individual', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('individual_registrations')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Group registration endpoint
app.post('/api/register/group', async (req, res) => {
  try {
    const data = req.body;
    const { error } = await supabase
      .from('group_registrations')
      .insert([
        {
          group_name: data.groupName,
          leader_name: data.leaderName,
          leader_email: data.leaderEmail,
          leader_phone: data.leaderPhone,
          church: data.church,
          country: data.country,
          indemnity: data.indemnity,
          accommodation: data.accommodation,
          bedding: data.bedding,
          dayPass: data.dayPass,
          payment: data.payment,
          commitment: data.commitment,
          members: data.members
        }
      ]);

    if (error) throw error;
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Group registration failed:', error);
    res.status(500).json({ error: 'Group registration failed' });
  }
});

// Get all group registrations
app.get('/api/registrations/group', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('group_registrations')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching group registrations:', error);
    res.status(500).json({ error: 'Failed to fetch group registrations' });
  }
});

// Admin authentication middleware
function authenticateAdmin(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    next();
  });
}

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    if (!req.body.password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Hash and compare password (in production, use bcrypt)
    const isPasswordValid = req.body.password === process.env.ADMIN_PASSWORD;
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        role: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      process.env.JWT_SECRET
    );

    console.log('Admin login successful');
    res.json({ 
      token,
      message: 'Login successful',
      expiresIn: '24h' 
    });
  } catch (error) {
    console.error('Admin login failed:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Admin endpoints (protected)
app.get('/api/admin/individuals', authenticateAdmin, async (req, res) => {
  try {
    const { data: individuals, error } = await supabase
      .from('individual_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(individuals);
  } catch (err) {
    console.error('Error fetching individuals:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/admin/groups', authenticateAdmin, async (req, res) => {
  try {
    const { data: groups, error } = await supabase
      .from('group_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(groups);
  } catch (err) {
    console.error('Error fetching groups:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Environment variables loaded: ${process.env.NODE_ENV}`);
  console.log(`Server is running on http://0.0.0.0:${port}`);
}).on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  console.error('Error stack:', err.stack);
  console.error('Request info:', {
    method: req.method,
    url: req.url,
    headers: req.headers
  });
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    details: err.message
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log('Listening on all interfaces (0.0.0.0)');
  console.log('Environment variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'Present' : 'Not present');
  console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? 'Present' : 'Not present');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'Not present');
});
