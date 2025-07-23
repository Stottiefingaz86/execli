// Run user authentication migration
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function runMigration() {
  console.log('🔧 Running User Authentication Migration...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Read the migration SQL file
    const migrationSQL = fs.readFileSync('user-auth-migration.sql', 'utf8');
    
    console.log('📝 Executing migration...');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      return;
    }
    
    console.log('✅ User authentication migration completed successfully!');
    
    // Test the new functions
    console.log('🧪 Testing new functions...');
    
    // Test create_partial_account function
    const { data: testUser, error: testError } = await supabase.rpc('create_partial_account', {
      user_email: 'test@migration.com'
    });
    
    if (testError) {
      console.error('❌ Test function failed:', testError);
    } else {
      console.log('✅ create_partial_account function working');
    }
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
}

runMigration(); 