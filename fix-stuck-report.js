const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key
const supabaseUrl = 'https://efiioacrgwuewmroztth.supabase.co';
// Note: You need to replace this with your actual service role key from Supabase dashboard
const supabaseServiceKey = 'your_actual_service_role_key_here'; // Replace with real key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixStuckReport() {
  try {
    console.log('Fixing stuck report...');
    
    // Get the stuck report
    const { data: report, error } = await supabase
      .from('voc_reports')
      .select('*')
      .eq('business_url', 'https://betonline.ag')
      .single();
    
    if (error) {
      console.error('Error fetching report:', error);
      return;
    }
    
    if (!report) {
      console.log('Report not found');
      return;
    }
    
    console.log('Found report:', {
      id: report.id,
      status: report.status,
      sources: report.sources,
      detected_sources: report.detected_sources
    });
    
    // If sources exist but detected_sources is null, copy sources to detected_sources
    if (report.sources && report.sources.length > 0 && !report.detected_sources) {
      console.log('Fixing detected_sources field...');
      
      const { error: updateError } = await supabase
        .from('voc_reports')
        .update({ 
          detected_sources: report.sources
        })
        .eq('id', report.id);
      
      if (updateError) {
        console.error('Error updating report:', updateError);
        return;
      }
      
      console.log('Successfully fixed detected_sources field');
      console.log('Report should now display correctly on the frontend');
    } else {
      console.log('Report already has detected_sources or no sources to copy');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixStuckReport(); 