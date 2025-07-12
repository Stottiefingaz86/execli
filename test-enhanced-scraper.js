const { EnhancedVOCScraper } = require('./lib/enhanced-scraper');

async function testEnhancedScraper() {
  const scraper = new EnhancedVOCScraper();
  
  try {
    console.log('Initializing enhanced scraper...');
    await scraper.init();
    
    // Test with a business that should have reviews
    const businessName = 'McDonald\'s';
    const businessUrl = 'https://www.mcdonalds.com';
    
    console.log(`Testing with: ${businessName} (${businessUrl})`);
    
    // Test source detection
    console.log('\n1. Testing source detection...');
    const detectedSources = await scraper.detectAllReviewSources(businessName, businessUrl);
    console.log('Detected sources:', detectedSources);
    
    // Test AI discovery
    console.log('\n2. Testing AI discovery...');
    const discoveredSources = await scraper.discoverAdditionalSources(businessName, businessUrl);
    console.log('Discovered sources:', discoveredSources);
    
    // Test full scraping workflow
    console.log('\n3. Testing full scraping workflow...');
    const scrapingResults = await scraper.scrapeAllSourcesWithData(
      'test-company-id',
      businessName,
      businessUrl,
      'free'
    );
    console.log('Scraping results:', scrapingResults);
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await scraper.close();
    console.log('\nTest completed.');
  }
}

testEnhancedScraper(); 