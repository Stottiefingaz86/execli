const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://efiioacrgwuewmroztth.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaWlvYWNyZ3d1ZXdtcm96dHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createFreshReport() {
  try {
    console.log('Creating a completely fresh report with random business name...');
    
    // Generate a completely random business name
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const businessName = `TestBusiness_${timestamp}_${randomId}`;
    const businessUrl = `https://testbusiness-${randomId}.com`;
    
    console.log(`Using unique business name: ${businessName}`);
    console.log(`Using unique business URL: ${businessUrl}`);
    
    // Create a new report with the unique business
    const { data: report, error: reportError } = await supabase
      .from('voc_reports')
      .insert({
        business_name: businessName,
        business_url: businessUrl,
        industry: 'Technology',
        status: 'processing',
        progress_message: 'Starting fresh report...'
      })
      .select()
      .single();
    
    if (reportError) {
      console.error('Error creating report:', reportError);
      return;
    }
    
    console.log('Created report with ID:', report.id);
    
    // Trigger the Edge Function with the unique business
    const response = await fetch('https://efiioacrgwuewmroztth.supabase.co/functions/v1/process-voc-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        report_id: report.id,
        company_id: report.id,
        business_name: businessName,
        business_url: businessUrl,
        email: 'test@example.com'
      })
    });
    
    if (response.ok) {
      console.log('✅ Successfully triggered fresh report generation');
      console.log('Report URL:', `https://execli.vercel.app/report/${report.id}`);
    } else {
      const errorText = await response.text();
      console.error('❌ Error triggering report:', errorText);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createFreshReport(); 