const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = 'https://efiioacrgwuewmroztth.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSpecificData() {
  console.log('🔍 Checking specific data in latest report...');
  
  try {
    // Get the latest report
    const { data: reports, error } = await supabase
      .from('voc_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error || !reports || reports.length === 0) {
      console.error('❌ Error fetching reports:', error);
      return;
    }
    
    const report = reports[0];
    console.log(`📊 Report: ${report.id}`);
    console.log(`🏢 Business: ${report.business_name}`);
    
    if (!report.analysis) {
      console.log('❌ No analysis data');
      return;
    }
    
    console.log('\n📊 EXECUTIVE SUMMARY SECTIONS:');
    if (report.analysis.executiveSummary) {
      const es = report.analysis.executiveSummary;
      
      console.log('\n🎉 PRAISED SECTIONS:');
      if (es.praisedSections && es.praisedSections.length > 0) {
        es.praisedSections.forEach((section, i) => {
          console.log(`  ${i + 1}. ${section.topic} (${section.percentage})`);
          if (section.examples && section.examples.length > 0) {
            console.log(`     Examples: ${section.examples.slice(0, 2).join(', ')}`);
          }
        });
      } else {
        console.log('  ❌ No praised sections');
      }
      
      console.log('\n⚠️ PAIN POINTS:');
      if (es.painPoints && es.painPoints.length > 0) {
        es.painPoints.forEach((point, i) => {
          console.log(`  ${i + 1}. ${point.topic} (${point.percentage})`);
          if (point.examples && point.examples.length > 0) {
            console.log(`     Examples: ${point.examples.slice(0, 2).join(', ')}`);
          }
        });
      } else {
        console.log('  ❌ No pain points');
      }
      
      console.log('\n🚨 ALERTS:');
      if (es.alerts && es.alerts.length > 0) {
        es.alerts.forEach((alert, i) => {
          console.log(`  ${i + 1}. ${alert.type}: ${alert.message} (${alert.metric})`);
        });
      } else {
        console.log('  ❌ No alerts');
      }
    }
    
    console.log('\n📊 MENTIONS BY TOPIC:');
    if (report.analysis.mentionsByTopic && report.analysis.mentionsByTopic.length > 0) {
      report.analysis.mentionsByTopic.forEach((topic, i) => {
        console.log(`  ${i + 1}. ${topic.topic}:`);
        console.log(`     Positive: ${topic.positive}%, Negative: ${topic.negative}%, Neutral: ${topic.neutral}%`);
        console.log(`     Total mentions: ${topic.total}`);
        
        // Check for casino/sports keywords
        const isCasinoSports = topic.topic.toLowerCase().includes('casino') || 
                              topic.topic.toLowerCase().includes('sport') ||
                              topic.topic.toLowerCase().includes('poker') ||
                              topic.topic.toLowerCase().includes('betting') ||
                              topic.topic.toLowerCase().includes('gambling');
        
        if (isCasinoSports) {
          console.log(`     🎰 CASINO/SPORTS TOPIC FOUND!`);
        }
      });
    } else {
      console.log('  ❌ No mentions by topic');
    }
    
    console.log('\n📈 SENTIMENT OVER TIME:');
    if (report.analysis.sentimentOverTime && report.analysis.sentimentOverTime.length > 0) {
      console.log(`  Found ${report.analysis.sentimentOverTime.length} sentiment data points`);
      report.analysis.sentimentOverTime.slice(0, 3).forEach((sentiment, i) => {
        console.log(`  ${i + 1}. ${sentiment.date}: ${sentiment.sentiment} (${sentiment.reviewCount} reviews)`);
      });
    } else {
      console.log('  ❌ No sentiment over time data');
    }
    
    console.log('\n📊 VOLUME OVER TIME:');
    if (report.analysis.volumeOverTime && report.analysis.volumeOverTime.length > 0) {
      console.log(`  Found ${report.analysis.volumeOverTime.length} volume data points`);
      report.analysis.volumeOverTime.slice(0, 3).forEach((volume, i) => {
        console.log(`  ${i + 1}. ${volume.date}: ${volume.volume} reviews`);
        if (volume.context) {
          console.log(`     Context: ${volume.context}`);
        }
      });
    } else {
      console.log('  ❌ No volume over time data');
    }
    
  } catch (error) {
    console.error('❌ Error during check:', error);
  }
}

checkSpecificData(); 