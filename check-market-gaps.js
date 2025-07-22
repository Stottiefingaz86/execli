const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://efiioacrgwuewmroztth.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaWlvYWNyZ3d1ZXdtcm96dHRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzQ5NzI5NywiZXhwIjoyMDUzMDczMjk3fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMarketGaps() {
  try {
    console.log('🔍 Checking market gaps in latest report...');
    
    // Get the latest report
    const { data: reports, error: reportsError } = await supabase
      .from('voc_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (reportsError) {
      console.error('Error fetching reports:', reportsError);
      return;
    }
    
    if (!reports || reports.length === 0) {
      console.log('No reports found');
      return;
    }
    
    const latestReport = reports[0];
    console.log(`📊 Latest report: ${latestReport.id}`);
    console.log(`🏢 Business: ${latestReport.business_name}`);
    
    if (!latestReport.analysis) {
      console.log('❌ No analysis data found');
      return;
    }
    
    const analysis = latestReport.analysis;
    console.log('✅ Analysis data found');
    
    // Check market gaps
    if (analysis.marketGaps && Array.isArray(analysis.marketGaps)) {
      console.log(`\n📊 MARKET GAPS (${analysis.marketGaps.length} gaps):`);
      
      analysis.marketGaps.forEach((gap, index) => {
        console.log(`\n${index + 1}. ${gap.gap}:`);
        console.log(`   Mentions: ${gap.mentions}`);
        console.log(`   Suggestion: ${gap.suggestion}`);
        console.log(`   KPI Impact: ${gap.kpiImpact}`);
        console.log(`   Opportunity: ${gap.opportunity}`);
        console.log(`   Business Case: ${gap.businessCase}`);
        console.log(`   Priority: ${gap.priority}`);
        console.log(`   Specific Examples: ${gap.specificExamples?.join(', ') || 'None'}`);
        console.log(`   Raw Mentions: ${gap.rawMentions?.length || 0} reviews`);
      });
    } else {
      console.log('❌ No market gaps data found');
    }
    
    // Also check if there are any AI market gaps
    if (analysis.aiMarketGaps && Array.isArray(analysis.aiMarketGaps)) {
      console.log(`\n🤖 AI MARKET GAPS (${analysis.aiMarketGaps.length} gaps):`);
      
      analysis.aiMarketGaps.forEach((gap, index) => {
        console.log(`\n${index + 1}. ${gap.gap}:`);
        console.log(`   Mentions: ${gap.mentions}`);
        console.log(`   Suggestion: ${gap.suggestion}`);
        console.log(`   KPI Impact: ${gap.kpiImpact}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkMarketGaps(); 