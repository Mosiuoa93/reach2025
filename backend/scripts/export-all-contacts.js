const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportAllContacts() {
    try {
        console.log('🔄 Starting REACH2025 contact data export...');
        
        // Fetch individual registrations
        console.log('📋 Fetching individual registrations...');
        const { data: individuals, error: individualsError } = await supabase
            .from('individual_registrations')
            .select('*');
            
        if (individualsError) {
            console.error('❌ Error fetching individuals:', individualsError);
            return;
        }
        
        // Fetch group registrations
        console.log('👥 Fetching group registrations...');
        const { data: groups, error: groupsError } = await supabase
            .from('group_registrations')
            .select('*');
            
        if (groupsError) {
            console.error('❌ Error fetching groups:', groupsError);
            return;
        }
        
        console.log(`✅ Found ${individuals?.length || 0} individual registrations`);
        console.log(`✅ Found ${groups?.length || 0} group registrations`);
        
        // Process individual contacts
        const individualContacts = (individuals || []).map(person => ({
            type: 'Individual',
            name: person.name || '',
            email: person.email || '',
            phone: person.phone || '',
            gender: person.gender || '',
            church: person.church || '',
            country: person.country || '',
            accommodation: person.accommodation || '',
            registration_date: person.created_at || '',
            checked_in: person.checked_in || false,
            group_name: '',
            group_leader: ''
        }));
        
        // Process group contacts (leaders + members)
        const groupContacts = [];
        
        (groups || []).forEach(group => {
            // Add group leader
            groupContacts.push({
                type: 'Group Leader',
                name: group.leader_name || '',
                email: group.leader_email || '',
                phone: group.leader_phone || '',
                gender: group.leader_gender || '',
                church: group.church || '',
                country: group.country || '',
                accommodation: group.accommodation || '',
                registration_date: group.created_at || '',
                checked_in: group.checked_in || false,
                group_name: group.group_name || '',
                group_leader: group.leader_name || ''
            });
            
            // Add group members
            if (group.members) {
                let members = [];
                try {
                    members = typeof group.members === 'string' ? JSON.parse(group.members) : group.members;
                } catch (e) {
                    console.warn(`⚠️ Could not parse members for group: ${group.group_name}`);
                }
                
                members.forEach(member => {
                    groupContacts.push({
                        type: 'Group Member',
                        name: member.name || '',
                        email: member.email || '',
                        phone: member.phone || '',
                        gender: member.gender || '',
                        church: group.church || '',
                        country: group.country || '',
                        accommodation: group.accommodation || '',
                        registration_date: group.created_at || '',
                        checked_in: group.checked_in || false,
                        group_name: group.group_name || '',
                        group_leader: group.leader_name || ''
                    });
                });
            }
        });
        
        // Combine all contacts
        const allContacts = [...individualContacts, ...groupContacts];
        
        console.log(`📊 Total contacts found: ${allContacts.length}`);
        console.log(`   - Individual registrations: ${individualContacts.length}`);
        console.log(`   - Group leaders: ${groups?.length || 0}`);
        console.log(`   - Group members: ${groupContacts.length - (groups?.length || 0)}`);
        
        // Create CSV content
        const csvHeaders = [
            'Type',
            'Name',
            'Email',
            'Phone',
            'Gender',
            'Church',
            'Country',
            'Accommodation',
            'Registration Date',
            'Checked In',
            'Group Name',
            'Group Leader'
        ];
        
        const csvRows = allContacts.map(contact => [
            contact.type,
            contact.name,
            contact.email,
            contact.phone,
            contact.gender,
            contact.church,
            contact.country,
            contact.accommodation,
            contact.registration_date,
            contact.checked_in ? 'Yes' : 'No',
            contact.group_name,
            contact.group_leader
        ]);
        
        const csvContent = [
            csvHeaders.join(','),
            ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n');
        
        // Save to file
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `REACH2025-All-Contacts-${timestamp}.csv`;
        const filepath = path.join(__dirname, filename);
        
        fs.writeFileSync(filepath, csvContent);
        
        console.log(`✅ Export completed successfully!`);
        console.log(`📁 File saved: ${filepath}`);
        console.log(`📊 Total contacts exported: ${allContacts.length}`);
        
        // Create summary statistics
        const stats = {
            totalContacts: allContacts.length,
            individuals: individualContacts.length,
            groupLeaders: groups?.length || 0,
            groupMembers: groupContacts.length - (groups?.length || 0),
            checkedIn: allContacts.filter(c => c.checked_in).length,
            byGender: {
                male: allContacts.filter(c => c.gender?.toLowerCase() === 'male').length,
                female: allContacts.filter(c => c.gender?.toLowerCase() === 'female').length,
                unspecified: allContacts.filter(c => !c.gender || c.gender === '').length
            },
            byCountry: {}
        };
        
        // Count by country
        allContacts.forEach(contact => {
            const country = contact.country || 'Unspecified';
            stats.byCountry[country] = (stats.byCountry[country] || 0) + 1;
        });
        
        console.log('\n📈 REACH2025 FINAL STATISTICS:');
        console.log(`   Total Attendees: ${stats.totalContacts}`);
        console.log(`   Individual Registrations: ${stats.individuals}`);
        console.log(`   Group Leaders: ${stats.groupLeaders}`);
        console.log(`   Group Members: ${stats.groupMembers}`);
        console.log(`   Checked In: ${stats.checkedIn}`);
        console.log(`   Gender Distribution:`);
        console.log(`     - Male: ${stats.byGender.male}`);
        console.log(`     - Female: ${stats.byGender.female}`);
        console.log(`     - Unspecified: ${stats.byGender.unspecified}`);
        console.log(`   Countries Represented: ${Object.keys(stats.byCountry).length}`);
        
        Object.entries(stats.byCountry).forEach(([country, count]) => {
            console.log(`     - ${country}: ${count}`);
        });
        
        return {
            success: true,
            filename,
            filepath,
            stats
        };
        
    } catch (error) {
        console.error('❌ Export failed:', error);
        return { success: false, error: error.message };
    }
}

// Run the export
if (require.main === module) {
    exportAllContacts()
        .then(result => {
            if (result.success) {
                console.log('\n🎉 REACH2025 contact export completed successfully!');
                process.exit(0);
            } else {
                console.error('\n💥 Export failed:', result.error);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('💥 Unexpected error:', error);
            process.exit(1);
        });
}

module.exports = { exportAllContacts };
