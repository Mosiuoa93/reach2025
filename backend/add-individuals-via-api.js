const { default: fetch } = require('node-fetch');

const sampleIndividuals = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "0821234567",
    church: "Grace Community Church",
    country: "South Africa",
    emergencyName: "John Johnson",
    emergencyContact: "0827654321",
    indemnity: true,
    accommodation: "dorm",
    bedding: true,
    payment: "paynow",
    commitment: true
  },
  {
    name: "Michael Thompson",
    email: "m.thompson@gmail.com",
    phone: "0834567890",
    church: "New Life Fellowship",
    country: "South Africa",
    emergencyName: "Lisa Thompson",
    emergencyContact: "0831234567",
    indemnity: true,
    accommodation: "hotel",
    bedding: false,
    payment: "eft",
    commitment: true
  },
  {
    name: "Priscilla Mthembu",
    email: "priscilla.mthembu@yahoo.com",
    phone: "0847891234",
    church: "Rhema Bible Church",
    country: "South Africa",
    emergencyName: "David Mthembu",
    emergencyContact: "0843456789",
    indemnity: true,
    accommodation: "dorm",
    bedding: true,
    payment: "paynow",
    commitment: true
  },
  {
    name: "James Ndlovu",
    email: "james.ndlovu@outlook.com",
    phone: "0765432109",
    church: "Victory Christian Centre",
    country: "South Africa",
    emergencyName: "Mary Ndlovu",
    emergencyContact: "0769876543",
    indemnity: true,
    accommodation: "daypass",
    bedding: false,
    payment: "cash",
    commitment: true
  },
  {
    name: "Grace Mokoena",
    email: "grace.mokoena@gmail.com",
    phone: "0712345678",
    church: "Hillsong Church",
    country: "South Africa",
    emergencyName: "Peter Mokoena",
    emergencyContact: "0718765432",
    indemnity: true,
    accommodation: "hotel",
    bedding: false,
    payment: "eft",
    commitment: true
  },
  {
    name: "Daniel Khumalo",
    email: "d.khumalo@email.com",
    phone: "0823456789",
    church: "International Pentecostal Church",
    country: "South Africa",
    emergencyName: "Susan Khumalo",
    emergencyContact: "0829876543",
    indemnity: true,
    accommodation: "dorm",
    bedding: true,
    payment: "paynow",
    commitment: true
  }
];

async function addIndividualsViaAPI() {
  console.log('🚀 Adding individual registrations via API...');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const individual of sampleIndividuals) {
    try {
      const response = await fetch('http://localhost:3000/api/register/individual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(individual)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Added: ${individual.name}`);
        successCount++;
      } else {
        console.log(`❌ Failed to add ${individual.name}:`, result.error);
        errorCount++;
      }
    } catch (error) {
      console.log(`❌ Error adding ${individual.name}:`, error.message);
      errorCount++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n📊 Summary: ${successCount} successful, ${errorCount} failed`);
  
  // Check final count
  try {
    const response = await fetch('http://localhost:3000/api/admin/individuals');
    const individuals = await response.json();
    console.log(`📈 Total individuals in database: ${individuals.length}`);
  } catch (error) {
    console.log('❌ Could not fetch final count:', error.message);
  }
}

addIndividualsViaAPI();
