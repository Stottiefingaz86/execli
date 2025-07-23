// Check report data in database
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function checkReportData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const reportId = '169cb1dc-0df5-443f-bf0f-ed9cda083c21';
  
  console.log('🔍 Checking report data in database...');
  
  try {
    // Get the report data
    const { data: report, error } = await supabase
      .from('voc_reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (error) {
      console.error('Error fetching report:', error);
      return;
    }
    
    console.log('Report data:', {
      id: report.id,
      status: report.status,
      progress_message: report.progress_message,
      analysis: report.analysis ? 'Present' : 'Missing',
      sources: report.sources ? 'Present' : 'Missing',
      detected_sources: report.detected_sources ? 'Present' : 'Missing'
    });
    
    if (report.analysis) {
      console.log('✅ Analysis found!');
      console.log('Analysis keys:', Object.keys(report.analysis));
      
      if (report.analysis.executiveSummary) {
        console.log('✅ Executive Summary found!');
        console.log('Executive Summary keys:', Object.keys(report.analysis.executiveSummary));
        
        if (report.analysis.executiveSummary.praisedSections) {
          console.log('✅ Praised Sections:', report.analysis.executiveSummary.praisedSections.length);
          console.log('Sample praised section:', report.analysis.executiveSummary.praisedSections[0]);
        }
        
        if (report.analysis.executiveSummary.painPoints) {
          console.log('✅ Pain Points:', report.analysis.executiveSummary.painPoints.length);
          console.log('Sample pain point:', report.analysis.executiveSummary.painPoints[0]);
        }
      }
      
      if (report.analysis.sentimentOverTime) {
        console.log('✅ Sentiment Over Time:', report.analysis.sentimentOverTime.length);
        if (report.analysis.sentimentOverTime.length > 0) {
          const firstSentiment = report.analysis.sentimentOverTime[0];
          console.log('First sentiment value:', firstSentiment.sentiment);
        }
      }
    } else {
      console.log('❌ No analysis found');
    }
    
    // Check reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('company_id', report.company_id);
    
    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
    } else {
      console.log('Reviews found:', reviews.length);
      if (reviews.length > 0) {
        console.log('Sample review:', {
          text: reviews[0].review_text.substring(0, 100),
          rating: reviews[0].rating,
          source: reviews[0].source_id
        });
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkReportData().then(() => {
  console.log('Check completed');
  process.exit(0);
}); 