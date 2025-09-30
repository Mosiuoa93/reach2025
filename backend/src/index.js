require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const supabase = require('./config/supabase');

const app = express();

// CORS: allow local dev, production domains, and Vercel previews
const allowedOrigins = [
  'http://localhost:3000',
  'https://reach-summit.co.za',
  'https://www.reach-summit.co.za'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or same-origin
    if (!origin) return callback(null, true);
    try {
      const hostname = new URL(origin).hostname;
      const isVercelPreview = hostname.endsWith('.vercel.app');
      if (allowedOrigins.includes(origin) || isVercelPreview) {
        return callback(null, true);
      }
    } catch (e) {
      // if origin is not a valid URL, reject
    }
    return callback(new Error('CORS not allowed'), false);
  },
  credentials: true
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});
class PricingService {
  static PRICES = {
    GUESTHOUSE: {
      REGULAR: 1900,
      EARLY_BIRD: 1650
    },
    DORMITORY: {
      REGULAR: 1650,
      EARLY_BIRD: 1400,
      STUDENT: 1155
    },
    DAY_PASS: {
      WITH_MEALS: 230,
      ENTRY_ONLY: 0
    },
    COUPLE: {
      REGULAR: 3500,
      EARLY_BIRD: 3000,
      CHILD_RATE: 1155 // Same as student rate
    }
  };

  static EARLY_BIRD_DEADLINE = new Date('2026-02-28');

  static isEarlyBirdPeriod() {
    return new Date() <= this.EARLY_BIRD_DEADLINE;
  }

  static calculateIndividualPrice(accommodation, dayPass, registrationType, dayPassMeals) {
    if (accommodation === 'daypass') {
      const days = (dayPass || []).length;
      return dayPassMeals ? days * this.PRICES.DAY_PASS.WITH_MEALS : this.PRICES.DAY_PASS.ENTRY_ONLY;
    }
    
    const isEarlyBird = this.isEarlyBirdPeriod();
    
    if (accommodation === 'guesthouse') {
      return isEarlyBird ? this.PRICES.GUESTHOUSE.EARLY_BIRD : this.PRICES.GUESTHOUSE.REGULAR;
    }
    
    if (accommodation === 'dorm') {
      if (registrationType === 'student') {
        return this.PRICES.DORMITORY.STUDENT;
      }
      return isEarlyBird ? this.PRICES.DORMITORY.EARLY_BIRD : this.PRICES.DORMITORY.REGULAR;
    }
    
    return 0;
  }

  static calculateGroupPrice(members) {
    // Total people = group leader + members
    const totalPeople = 1 + (members || []).length;
    
    // Base price per person (early bird or regular)
    const isEarlyBird = this.isEarlyBirdPeriod();
    const basePrice = isEarlyBird ? this.PRICES.DORMITORY.EARLY_BIRD : this.PRICES.DORMITORY.REGULAR;
    
    // Calculate subtotal
    const subtotal = totalPeople * basePrice;
    
    // Apply group discounts
    let discount = 0;
    let discountPercentage = 0;
    
    if (totalPeople >= 21) {
      discountPercentage = 20;
      discount = subtotal * 0.20;
    } else if (totalPeople >= 11) {
      discountPercentage = 10;
      discount = subtotal * 0.10;
    }
    
    const total = subtotal - discount;
    
    return {
      totalPeople,
      basePrice,
      subtotal,
      discountPercentage,
      discount,
      total,
      isEarlyBird
    };
  }

  static calculateCouplePrice(children) {
    const isEarlyBird = this.isEarlyBirdPeriod();
    
    // Base couple price (for 2 adults)
    const coupleBasePrice = isEarlyBird ? this.PRICES.COUPLE.EARLY_BIRD : this.PRICES.COUPLE.REGULAR;
    
    // Children pricing (each child at student rate)
    const childrenCount = (children || []).length;
    const childrenTotal = childrenCount * this.PRICES.COUPLE.CHILD_RATE;
    
    const total = coupleBasePrice + childrenTotal;
    
    return {
      coupleBasePrice,
      childrenCount,
      childRate: this.PRICES.COUPLE.CHILD_RATE,
      childrenTotal,
      total,
      isEarlyBird,
      breakdown: {
        adults: 2,
        children: childrenCount,
        totalPeople: 2 + childrenCount
      }
    };
  }

  static getPricingInfo() {
    const isEarlyBird = this.isEarlyBirdPeriod();
    return {
      isEarlyBird,
      earlyBirdDeadline: this.EARLY_BIRD_DEADLINE.toISOString(),
      prices: {
        guesthouse: {
          current: isEarlyBird ? this.PRICES.GUESTHOUSE.EARLY_BIRD : this.PRICES.GUESTHOUSE.REGULAR,
          regular: this.PRICES.GUESTHOUSE.REGULAR,
          earlyBird: this.PRICES.GUESTHOUSE.EARLY_BIRD,
          studentAvailable: false
        },
        dormitory: {
          current: isEarlyBird ? this.PRICES.DORMITORY.EARLY_BIRD : this.PRICES.DORMITORY.REGULAR,
          regular: this.PRICES.DORMITORY.REGULAR,
          earlyBird: this.PRICES.DORMITORY.EARLY_BIRD,
          student: this.PRICES.DORMITORY.STUDENT,
          studentAvailable: true
        },
        dayPass: {
          withMeals: this.PRICES.DAY_PASS.WITH_MEALS,
          entryOnly: this.PRICES.DAY_PASS.ENTRY_ONLY
        },
        couple: {
          current: isEarlyBird ? this.PRICES.COUPLE.EARLY_BIRD : this.PRICES.COUPLE.REGULAR,
          regular: this.PRICES.COUPLE.REGULAR,
          earlyBird: this.PRICES.COUPLE.EARLY_BIRD,
          childRate: this.PRICES.COUPLE.CHILD_RATE
        }
      }
    };
  }
}

// Legacy function for backward compatibility
function calculateIndividualPrice(accommodation, dayPass, registrationType, dayPassMeals) {
  return PricingService.calculateIndividualPrice(accommodation, dayPass, registrationType, dayPassMeals);
}

// Pricing API endpoints
app.get('/api/pricing/info', (req, res) => {
  try {
    const pricingInfo = PricingService.getPricingInfo();
    res.json(pricingInfo);
  } catch (error) {
    console.error('Error getting pricing info:', error);
    res.status(500).json({ error: 'Failed to get pricing information' });
  }
});

app.post('/api/pricing/calculate', (req, res) => {
  try {
    const { accommodation, dayPass, registrationType, dayPassMeals } = req.body;
    const total = PricingService.calculateIndividualPrice(accommodation, dayPass, registrationType, dayPassMeals);
    
    res.json({
      total,
      breakdown: {
        accommodation,
        registrationType,
        dayPass: dayPass || [],
        dayPassMeals,
        isEarlyBird: PricingService.isEarlyBirdPeriod()
      }
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({ error: 'Failed to calculate price' });
  }
});

app.post('/api/pricing/calculate-group', (req, res) => {
  try {
    const { members } = req.body;
    const pricing = PricingService.calculateGroupPrice(members);
    
    res.json(pricing);
  } catch (error) {
    console.error('Error calculating group price:', error);
    res.status(500).json({ error: 'Failed to calculate group price' });
  }
});

app.post('/api/pricing/calculate-couple', (req, res) => {
  try {
    const { children } = req.body;
    const pricing = PricingService.calculateCouplePrice(children);
    
    res.json(pricing);
  } catch (error) {
    console.error('Error calculating couple price:', error);
    res.status(500).json({ error: 'Failed to calculate couple price' });
  }
});

// Individual registration endpoint
app.post('/api/register/individual', async (req, res) => {
  const data = req.body;
  
  // Calculate total price
  const total = calculateIndividualPrice(data.accommodation, data.dayPass, data.registrationType, data.dayPassMeals);
  
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
        dayPassMeals: data.dayPassMeals !== undefined ? data.dayPassMeals : true,
        payment: data.payment,
        commitment: data.commitment,
        registrationType: data.registrationType || 'regular',
        total: total
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

  // Calculate pricing using backend service
  const pricing = PricingService.calculateGroupPrice(data.members);

  try {
    const { error } = await supabase
      .from('group_registrations')
      .insert({
        leader_name: data.leader.name,
        leader_email: data.leader.email,
        leader_phone: data.leader.phone,
        leader_church: data.leader.church,
        leader_country: data.leader.country,
        accommodation: 'dorm', // Groups use dormitory accommodation
        payment: data.payment,
        total: pricing.total,
        discount: pricing.discount,
        discount_percentage: pricing.discountPercentage,
        total_people: pricing.totalPeople,
        base_price: pricing.basePrice,
        subtotal: pricing.subtotal,
        members: data.members
      });

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving group registration:', err);
    res.status(500).json({ success: false, error: 'DB error' });
  }
});

// Couple registration endpoint
app.post('/api/register/couple', async (req, res) => {
  const data = req.body;

  // Calculate pricing using backend service
  const pricing = PricingService.calculateCouplePrice(data.children);

  try {
    const { error } = await supabase
      .from('couple_registrations')
      .insert({
        partner1_name: data.partner1.name,
        partner1_email: data.partner1.email,
        partner1_phone: data.partner1.phone,
        partner1_gender: data.partner1.gender,
        partner2_name: data.partner2.name,
        partner2_email: data.partner2.email,
        partner2_phone: data.partner2.phone,
        partner2_gender: data.partner2.gender,
        church: data.church,
        country: data.country,
        emergency_name: data.emergencyName,
        emergency_contact: data.emergencyContact,
        accommodation: 'dorm', // Couples use dormitory accommodation
        payment: data.payment,
        total: pricing.total,
        couple_base_price: pricing.coupleBasePrice,
        children_count: pricing.childrenCount,
        children_total: pricing.childrenTotal,
        child_rate: pricing.childRate,
        total_people: pricing.breakdown.totalPeople,
        children: data.children || []
      });

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving couple registration:', err);
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
