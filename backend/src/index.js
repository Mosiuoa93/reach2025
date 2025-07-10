require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

// PostgreSQL connection
const db = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'reach2025',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

db.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    // Create tables if not exist (Postgres syntax)
    db.query(`
      CREATE TABLE IF NOT EXISTS individual_registrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(50),
        church VARCHAR(100),
        country VARCHAR(100),
        emergencyName VARCHAR(100),
        emergencyContact VARCHAR(100),
        indemnity BOOLEAN,
        accommodation VARCHAR(20),
        bedding BOOLEAN,
        dayPass TEXT,
        payment VARCHAR(20),
        commitment VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS group_registrations (
        id SERIAL PRIMARY KEY,
        leader_name VARCHAR(100),
        leader_email VARCHAR(100),
        leader_phone VARCHAR(50),
        leader_church VARCHAR(100),
        leader_country VARCHAR(100),
        accommodation VARCHAR(20),
        payment VARCHAR(20),
        total DECIMAL(10,2),
        discount DECIMAL(10,2),
        members TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
      .catch(err => console.error('Error creating tables:', err));
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err);
    process.exit(1);
  });
app.use(cors({
  origin: [
    'https://www.reach-summit.co.za',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).type('text').send('REACH2025 Backend API is running.');
});

// Individual registration endpoint
app.post('/api/register/individual', (req, res) => {
  const data = req.body;
  db.query(
    `INSERT INTO individual_registrations 
      (name, email, phone, church, country, emergencyName, emergencyContact, indemnity, accommodation, bedding, dayPass, payment, commitment) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [
      data.name, data.email, data.phone, data.church, data.country,
      data.emergencyName, data.emergencyContact, data.indemnity,
      data.accommodation, data.bedding,
      JSON.stringify(data.dayPass || []),
      data.payment, data.commitment
    ]
  )
    .then(() => res.json({ success: true }))
    .catch(err => {
      console.error('Error saving individual registration:', err);
      res.status(500).json({ success: false, error: 'DB error' });
    });
});

// Group registration endpoint
app.post('/api/register/group', (req, res) => {
  const data = req.body;

  // Validate that every member has a phone number
  if (!Array.isArray(data.members) || data.members.some(m => !m.phone || m.phone.trim() === '')) {
    return res.status(400).json({ success: false, error: 'Each group member must have a phone number.' });
  }

  db.query(
    `INSERT INTO group_registrations 
      (leader_name, leader_email, leader_phone, leader_church, leader_country, accommodation, payment, total, discount, members) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)` ,
    [
      data.leader.name, data.leader.email, data.leader.phone, data.leader.church, data.leader.country,
      data.accommodation, data.payment, data.total, data.discount,
      JSON.stringify(data.members)
    ]
  )
    .then(() => res.json({ success: true }))
    .catch(err => {
      console.error('Error saving group registration:', err);
      res.status(500).json({ success: false, error: 'DB error' });
    });
});

// Admin authentication middleware
function authenticateAdmin(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.admin = decoded;
    next();
  });
}

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Protected Admin API endpoints
app.get('/api/admin/individuals', authenticateAdmin, (req, res) => {
  db.query('SELECT * FROM individual_registrations ORDER BY created_at DESC')
    .then(result => {
      const results = result.rows;
      // Parse JSON fields
      results.forEach(row => {
        try {
          row.dayPass = JSON.parse(row.dayPass || '[]');
        } catch { row.dayPass = []; }
      });
      res.json(results);
    })
    .catch(() => res.status(500).json([]));
});

app.get('/api/admin/groups', authenticateAdmin, (req, res) => {
  db.query('SELECT * FROM group_registrations ORDER BY created_at DESC')
    .then(result => {
      const results = result.rows;
      // Parse JSON fields
      results.forEach(row => {
        try {
          row.members = JSON.parse(row.members || '[]');
        } catch { row.members = []; }
      });
      res.json(results);
    })
    .catch(() => res.status(500).json([]));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
