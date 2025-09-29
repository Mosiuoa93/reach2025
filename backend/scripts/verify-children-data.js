const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://khogffdfjjigxgucsqlg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtob2dmZmRmamppZ3hndWNzcWxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjA5Mzc0OCwiZXhwIjoyMDY3NjY5NzQ4fQ.iijBfSCvBImjGZIutk_Pa-WdBo6OiTevdh5eRNgVB-8';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyChildrenData() {
  console.log('🔍 Verifying children data in database...\n');
  
  try {
    // Get all couples with children
    const { data: couples, error } = await supabase
      .from('couple_registrations')
      .select('*')
      .gt('children_count', 0)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('❌ Error fetching couples:', error);
      return;
    }
    
    console.log(`✅ Found ${couples.length} families with children:`);
    
    couples.forEach((couple, index) => {
      console.log(`\n👨‍👩‍👧‍👦 Family ${index + 1}:`);
      console.log(`  Partners: ${couple.partner1_name} & ${couple.partner2_name}`);
      console.log(`  Children Count: ${couple.children_count}`);
      console.log(`  Total: R${couple.total}`);
      
      // Parse children data
      try {
        const children = JSON.parse(couple.children);
        console.log('  Children:');
        children.forEach((child, childIndex) => {
          const pricing = child.age < 12 ? 'Free' : 
                         child.age <= 18 ? 'R1,300' : 'R2,600';
          console.log(`    ${childIndex + 1}. ${child.name} (${child.age}, ${child.gender}) - ${pricing}`);
        });
      } catch (e) {
        console.log('  Children data parsing error:', e.message);
      }
      
      console.log(`  Registered: ${new Date(couple.created_at).toLocaleString()}`);
    });
    
    if (couples.length === 0) {
      console.log('⚠️  No families with children found in database');
      console.log('🧪 Try registering a family with children first');
    }
    
  } catch (err) {
    console.error('💥 Verification failed:', err);
  }
}

verifyChildrenData();
