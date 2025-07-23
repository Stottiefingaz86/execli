// Test script to verify the fixes are working
require('dotenv').config({ path: '.env.local' });

async function testNewReportWithFixes() {
  console.log('🔍 Testing New Report with Fixes...');
  
  try {
    // Test the scrape API endpoint
    const response = await fetch('http://localhost:3000/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_name: 'Test Company Fixes',
        business_url: 'https://testcompanyfixes.com',
        email: 'test@fixes.com'
      })
    });
    
    console.log('Response status:', response.status);
    
    const result = await response.text();
    console.log('Response body:', result);
    
    try {
      const jsonResult = JSON.parse(result);
      console.log('Parsed JSON:', jsonResult);
      
      if (jsonResult.report_id) {
        console.log('✅ Report created successfully with ID:', jsonResult.report_id);
        
        // Wait a bit for processing to start
        console.log('⏳ Waiting for processing to start...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Test the report status API
        console.log('🔍 Testing report status...');
        const statusResponse = await fetch(`http://localhost:3000/api/report-status?report_id=${jsonResult.report_id}`);
        const statusResult = await statusResponse.json();
        console.log('Status response:', statusResult);
        
        // Check if analysis is being generated
        if (statusResult.analysis) {
          console.log('✅ Analysis data found!');
          console.log('Analysis keys:', Object.keys(statusResult.analysis));
          
          // Check for executive summary data
          if (statusResult.analysis.executiveSummary) {
            console.log('✅ Executive Summary found!');
            console.log('Executive Summary keys:', Object.keys(statusResult.analysis.executiveSummary));
            
            if (statusResult.analysis.executiveSummary.praisedSections) {
              console.log('✅ Praised Sections found:', statusResult.analysis.executiveSummary.praisedSections.length);
            }
            
            if (statusResult.analysis.executiveSummary.painPoints) {
              console.log('✅ Pain Points found:', statusResult.analysis.executiveSummary.painPoints.length);
            }
          }
          
          // Check for sentiment data
          if (statusResult.analysis.sentimentOverTime) {
            console.log('✅ Sentiment Over Time found:', statusResult.analysis.sentimentOverTime.length);
            if (statusResult.analysis.sentimentOverTime.length > 0) {
              const firstSentiment = statusResult.analysis.sentimentOverTime[0];
              console.log('First sentiment value:', firstSentiment.sentiment);
              if (firstSentiment.sentiment >= 10) {
                console.log('✅ Sentiment value is realistic (>10)');
              } else {
                console.log('❌ Sentiment value is still too low:', firstSentiment.sentiment);
              }
            }
          }
        } else {
          console.log('⏳ Analysis not ready yet, status:', statusResult.status);
        }
      } else {
        console.log('❌ No report ID returned');
      }
    } catch (parseError) {
      console.log('❌ Failed to parse response as JSON:', parseError);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testNewReportWithFixes().then(() => {
  console.log('Test completed');
  process.exit(0);
}); 