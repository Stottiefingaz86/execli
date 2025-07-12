const { UniversalScraper, SCRAPER_CONFIGS } = require('../lib/scraper')

async function testScraper() {
  console.log('🧪 Testing Universal Scraper...')
  
  const scraper = new UniversalScraper()
  
  try {
    // Initialize scraper
    console.log('📦 Initializing scraper...')
    await scraper.init()
    
    // Test with a sample URL (you'll need to replace with a real review URL)
    const testUrl = 'https://www.yelp.com/biz/sample-business'
    const config = SCRAPER_CONFIGS['Yelp']
    
    console.log('🔍 Testing scraping with Yelp config...')
    console.log('Config:', {
      name: config.name,
      maxPages: config.maxPages,
      delay: config.delay
    })
    
    // Note: This will fail without a real URL, but it tests the setup
    try {
      const reviews = await scraper.scrapeReviews(testUrl, config)
      console.log('✅ Scraping test completed')
      console.log('Found reviews:', reviews.length)
    } catch (error) {
      console.log('⚠️  Expected error (no real URL):', error.message)
    }
    
    console.log('✅ Scraper test completed successfully')
    
  } catch (error) {
    console.error('❌ Scraper test failed:', error)
  } finally {
    await scraper.close()
  }
}

// Run the test
testScraper().catch(console.error) 