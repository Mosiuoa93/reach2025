require('dotenv').config();
const supabase = require('./src/config/supabase');

// Based on the group structure, let's try with minimal fields
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

async function addSimpleIndividuals() {
  console.log('🚀 Adding simple individual registrations...');
  
  try {
    // First, let's see what columns exist by trying to fetch the structure
    const { data: existingData, error: fetchError } = await supabase
      .from('individual_registrations')
      .select('*')
      .limit(1);
      
    if (fetchError) {
      console.log('❌ Error fetching existing data:', fetchError);
    } else {
      console.log('📋 Existing data structure:', existingData);
    }
    
    // Try inserting one record at a time to see what works
    for (const individual of sampleIndividuals) {
      try {
        const { data, error } = await supabase
          .from('individual_registrations')
          .insert(individual);
          
        if (error) {
          console.log(`❌ Error adding ${individual.name}:`, error);
        } else {
          console.log(`✅ Added: ${individual.name}`);
        }
      } catch (err) {
        console.log(`❌ Exception adding ${individual.name}:`, err.message);
      }
    }
    
    // Check final count
    const { data: allIndividuals, error: countError } = await supabase
      .from('individual_registrations')
      .select('*');
      
    if (countError) {
      console.log('❌ Error getting count:', countError);
    } else {
      console.log(`📊 Total individuals in database: ${allIndividuals.length}`);
    }
    
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
}

addSimpleIndividuals();
