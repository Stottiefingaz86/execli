const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://efiioacrgwuewmroztth.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaWlvYWNyZ3d1ZXdtcm96dHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearAnalysisData() {
  try {
    console.log('Clearing analysis data from existing reports...');
    
    // Update all reports to clear their analysis data
    const { data, error } = await supabase
      .from('voc_reports')
      .update({ 
        analysis: null,
        progress_message: 'Initializing your report...',
        status: 'processing'
      })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all reports except dummy ones
    
    if (error) {
      console.error('Error clearing analysis data:', error);
      return;
    }
    
    console.log('Successfully cleared analysis data from all reports');
    console.log('Reports will now regenerate with the new AI prompt when accessed');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

clearAnalysisData(); 