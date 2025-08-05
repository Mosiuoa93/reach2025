require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const supabase = require('./config/supabase');

const app = express();

app.use(cors({
  origin: [
    'https://www.reach-summit.co.za',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));

// Individual registration endpoint
app.post('/api/register/individual', async (req, res) => {
  const data = req.body;
  try {
    const { error } = await supabase
      .from('individual_registrations')
      .insert({
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
        dayPass: data.dayPass || [],
        payment: data.payment,
        commitment: data.commitment
      });

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving individual registration:', err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

// Group registration endpoint
app.post('/api/register/group', async (req, res) => {
  const data = req.body;

  // Validate that every member has a phone number
  if (!Array.isArray(data.members) || data.members.some(m => !m.phone || m.phone.trim() === '')) {
    return res.status(400).json({ success: false, error: 'Each group member must have a phone number.' });
  }

  try {
    const { error } = await supabase
      .from('group_registrations')
      .insert({
        leader_name: data.leader.name,
        leader_email: data.leader.email,
        leader_phone: data.leader.phone,
        leader_church: data.leader.church,
        leader_country: data.leader.country,
        accommodation: data.accommodation,
        payment: data.payment,
        total: data.total,
        discount: data.discount,
        members: data.members
      });

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving group registration:', err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
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
app.get('/api/admin/individuals', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('individual_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching admin individuals:', err);
    res.status(500).json([]);
  }
});

app.get('/api/admin/groups', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('group_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching admin groups:', err);
    res.status(500).json([]);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
