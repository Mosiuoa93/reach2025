require('dotenv').config();
const supabase = require('./src/config/supabase');

// Let's try with just the absolute minimum fields
const sampleIndividuals = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "0821234567",
    church: "Grace Community Church",
    country: "South Africa",
    accommodation: "dorm",
    payment: "paynow"
  },
  {
    name: "Michael Thompson",
    email: "m.thompson@gmail.com",
    phone: "0834567890",
    church: "New Life Fellowship",
    country: "South Africa",
    accommodation: "hotel",
    payment: "eft"
  },
  {
    name: "Priscilla Mthembu",
    email: "priscilla.mthembu@yahoo.com",
    phone: "0847891234",
    church: "Rhema Bible Church",
    country: "South Africa",
    accommodation: "dorm",
    payment: "paynow"
  },
  {
    name: "James Ndlovu",
    email: "james.ndlovu@outlook.com",
    phone: "0765432109",
    church: "Victory Christian Centre",
    country: "South Africa",
    accommodation: "daypass",
    payment: "cash"
  },
  {
    name: "Grace Mokoena",
    email: "grace.mokoena@gmail.com",
    phone: "0712345678",
    church: "Hillsong Church",
    country: "South Africa",
    accommodation: "hotel",
    payment: "eft"
  },
  {
    name: "Daniel Khumalo",
    email: "d.khumalo@email.com",
    phone: "0823456789",
    church: "International Pentecostal Church",
    country: "South Africa",
    accommodation: "dorm",
    payment: "paynow"
  }
];

const processedIndividuals = sampleIndividuals;

async function addSampleIndividuals() {
  console.log('🚀 Adding sample individual registrations...');
  
  try {
    const { data, error } = await supabase
      .from('individual_registrations')
      .insert(processedIndividuals);

    if (error) {
      console.error('❌ Error adding individuals:', error);
      return;
    }

    console.log('✅ Successfully added', processedIndividuals.length, 'individual registrations!');
    
    // Verify the data was added
    const { data: allIndividuals, error: fetchError } = await supabase
      .from('individual_registrations')
      .select('*');

    if (fetchError) {
      console.error('❌ Error fetching individuals:', fetchError);
    } else {
      console.log('📊 Total individuals in database:', allIndividuals.length);
    }

  } catch (err) {
    console.error('❌ Failed to add sample data:', err.message);
  }
}

addSampleIndividuals();
