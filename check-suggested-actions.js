const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSuggestedActions() {
  try {
    console.log('🔍 Checking suggested actions in latest report...');
    
    // Get the latest report
    const { data: reports, error } = await supabase
      .from('voc_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Error fetching reports:', error);
      return;
    }
    
    if (!reports || reports.length === 0) {
      console.log('❌ No reports found');
      return;
    }
    
    const latestReport = reports[0];
    console.log(`📊 Latest report: ${latestReport.id}`);
    console.log(`🏢 Business: ${latestReport.business_name}`);
    console.log(`📅 Created: ${latestReport.created_at}`);
    console.log(`📈 Status: ${latestReport.status}`);
    
    if (!latestReport.analysis) {
      console.log('❌ No analysis data found');
      return;
    }
    
    const analysis = latestReport.analysis;
    
    console.log('\n📊 SUGGESTED ACTIONS:');
    
    if (analysis.suggestedActions && Array.isArray(analysis.suggestedActions)) {
      console.log(`✅ Found ${analysis.suggestedActions.length} suggested actions`);
      
      analysis.suggestedActions.forEach((action, index) => {
        console.log(`\n${index + 1}. ${action.action || 'No action title'}`);
        console.log(`   Pain Point: ${action.painPoint || 'N/A'}`);
        console.log(`   Recommendation: ${action.recommendation || 'N/A'}`);
        console.log(`   KPI Impact: ${action.kpiImpact || 'N/A'}`);
        console.log(`   Raw Mentions: ${action.rawMentions ? action.rawMentions.length : 0} reviews`);
        console.log(`   Context: ${action.context || 'N/A'}`);
        console.log(`   Expected Outcome: ${action.expectedOutcome || 'N/A'}`);
      });
    } else {
      console.log('❌ No suggested actions found');
    }
    
    console.log('\n📊 MARKET GAPS:');
    
    if (analysis.marketGaps && Array.isArray(analysis.marketGaps)) {
      console.log(`✅ Found ${analysis.marketGaps.length} market gaps`);
      
      analysis.marketGaps.forEach((gap, index) => {
        console.log(`\n${index + 1}. ${gap.gap || 'No gap title'}`);
        console.log(`   Mentions: ${gap.mentions || 0}`);
        console.log(`   Suggestion: ${gap.suggestion || 'N/A'}`);
        console.log(`   KPI Impact: ${gap.kpiImpact || 'N/A'}`);
        console.log(`   Opportunity: ${gap.opportunity || 'N/A'}`);
        console.log(`   Business Case: ${gap.businessCase || 'N/A'}`);
        console.log(`   Priority: ${gap.priority || 'N/A'}`);
        console.log(`   Raw Mentions: ${gap.rawMentions ? gap.rawMentions.length : 0} reviews`);
      });
    } else {
      console.log('❌ No market gaps found');
    }
    
    console.log('\n📊 AI MARKET GAPS:');
    
    if (analysis.aiMarketGaps && Array.isArray(analysis.aiMarketGaps)) {
      console.log(`✅ Found ${analysis.aiMarketGaps.length} AI market gaps`);
      
      analysis.aiMarketGaps.forEach((gap, index) => {
        console.log(`\n${index + 1}. ${gap.gap || 'No gap title'}`);
        console.log(`   Mentions: ${gap.mentions || 0}`);
        console.log(`   Suggestion: ${gap.suggestion || 'N/A'}`);
        console.log(`   KPI Impact: ${gap.kpiImpact || 'N/A'}`);
        console.log(`   Opportunity: ${gap.opportunity || 'N/A'}`);
        console.log(`   Business Case: ${gap.businessCase || 'N/A'}`);
        console.log(`   Priority: ${gap.priority || 'N/A'}`);
        console.log(`   Raw Mentions: ${gap.rawMentions ? gap.rawMentions.length : 0} reviews`);
      });
    } else {
      console.log('❌ No AI market gaps found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkSuggestedActions(); 