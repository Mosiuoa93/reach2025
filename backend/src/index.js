require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'reach2025',
  multipleStatements: true
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL');
    // Create tables if not exist
    db.query(`
      CREATE TABLE IF NOT EXISTS individual_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
        commitment BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS group_registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
    `, (err) => {
      if (err) console.error('Error creating tables:', err);
    });
  }
});
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('REACH2025 Backend API is running.');
});

// Individual registration endpoint
app.post('/api/register/individual', (req, res) => {
  const data = req.body;
  db.query(
    `INSERT INTO individual_registrations 
      (name, email, phone, church, country, emergencyName, emergencyContact, indemnity, accommodation, bedding, dayPass, payment, commitment) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name, data.email, data.phone, data.church, data.country,
      data.emergencyName, data.emergencyContact, data.indemnity,
      data.accommodation, data.bedding,
      JSON.stringify(data.dayPass || []),
      data.payment, data.commitment
    ],
    (err, result) => {
      if (err) {
        console.error('Error saving individual registration:', err);
        return res.status(500).json({ success: false, error: 'DB error' });
      }
      res.json({ success: true });
    }
  );
});

// Group registration endpoint
app.post('/api/register/group', (req, res) => {
  const data = req.body;
  db.query(
    `INSERT INTO group_registrations 
      (leader_name, leader_email, leader_phone, leader_church, leader_country, accommodation, payment, total, discount, members) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
    [
      data.leader.name, data.leader.email, data.leader.phone, data.leader.church, data.leader.country,
      data.accommodation, data.payment, data.total, data.discount,
      JSON.stringify(data.members)
    ],
    (err, result) => {
      if (err) {
        console.error('Error saving group registration:', err);
        return res.status(500).json({ success: false, error: 'DB error' });
      }
      res.json({ success: true });
    }
  );
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
  db.query('SELECT * FROM individual_registrations ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json([]);
    // Parse JSON fields
    results.forEach(row => {
      try {
        row.dayPass = JSON.parse(row.dayPass || '[]');
      } catch { row.dayPass = []; }
    });
    res.json(results);
  });
});

app.get('/api/admin/groups', authenticateAdmin, (req, res) => {
  db.query('SELECT * FROM group_registrations ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json([]);
    // Parse JSON fields
    results.forEach(row => {
      try {
        row.members = JSON.parse(row.members || '[]');
      } catch { row.members = []; }
    });
    res.json(results);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
