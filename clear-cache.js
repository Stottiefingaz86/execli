const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://efiioacrgwuewmroztth.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaWlvYWNyZ3d1ZXdtcm96dHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearCacheAndForceFresh() {
  try {
    console.log('Clearing all cached data to force fresh reports...');
    
    // Clear all analysis data from existing reports
    const { data: reports, error: reportsError } = await supabase
      .from('voc_reports')
      .update({ 
        analysis: null,
        progress_message: 'Initializing fresh report...',
        status: 'processing'
      })
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (reportsError) {
      console.error('Error clearing reports:', reportsError);
      return;
    }
    
    // Clear all stored reviews
    const { error: reviewsError } = await supabase
      .from('reviews')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (reviewsError) {
      console.error('Error clearing reviews:', reviewsError);
      return;
    }
    
    // Clear companies status
    const { error: companiesError } = await supabase
      .from('companies')
      .update({ 
        status: 'processing',
        last_updated: new Date().toISOString()
      })
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (companiesError) {
      console.error('Error clearing companies:', companiesError);
      return;
    }
    
    console.log('Successfully cleared all cached data!');
    console.log('Next reports will be generated with fresh data and updated logic.');
    console.log('The fixes for sentiment analysis and review counts will now be active.');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

clearCacheAndForceFresh(); 