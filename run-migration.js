const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('Running migration to add IP tracking...');
    
    // Execute the migration statements one by one
    const migrationStatements = [
      "ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS ip_address TEXT",
      "ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
      "ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS restriction_level TEXT DEFAULT 'free'",
      "CREATE INDEX IF NOT EXISTS idx_companies_email ON public.companies(email)",
      "CREATE INDEX IF NOT EXISTS idx_companies_ip ON public.companies(ip_address)"
    ];
    
    for (const statement of migrationStatements) {
      console.log(`Executing: ${statement}`);
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error('Migration failed:', error);
        process.exit(1);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration(); 