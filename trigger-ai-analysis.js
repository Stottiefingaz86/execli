// Trigger real AI analysis for the stuck report
// This will analyze the actual 40 Trustpilot reviews with AI

const { createClient } = require('@supabase/supabase-js');

// Use the anon key since we're just reading/updating
const supabaseUrl = 'https://efiioacrgwuewmroztth.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaWlvYWNyZ3d1ZXdtcm96dHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.Ej8TYLFFiEyiTx6Q5yGSYH7Rg8FE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function triggerAIAnalysis() {
  try {
    console.log('🤖 Triggering real AI analysis for the stuck report...');
    
    // First, let's trigger the edge function to re-analyze
    const response = await fetch('http://localhost:3000/api/regenerate-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        reportId: '-fca57692b8ab'
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error triggering regeneration:', errorText);
      return;
    }
    
    const result = await response.json();
    console.log('✅ Regeneration triggered:', result);
    
    console.log('🔄 The edge function will now:');
    console.log('   1. Re-analyze the 40 Trustpilot reviews with AI');
    console.log('   2. Generate real insights from the actual review data');
    console.log('   3. Store the analysis in the database');
    console.log('   4. Update the report status to complete');
    
    console.log('\n⏳ This will take 2-3 minutes...');
    console.log('🌐 Check the report at: http://localhost:3000/report/-fca57692b8ab');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

triggerAIAnalysis(); 