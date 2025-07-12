import { NextRequest, NextResponse } from 'next/server'
import { ScraperAPIVOCScraper } from '../../../lib/scraperapi-scraper'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { business_name = 'betonline' } = body

    console.log('Testing ScraperAPI with business:', business_name)

    const scraper = new ScraperAPIVOCScraper()
    
    // Test scraping with a temporary company ID
    const tempCompanyId = 'test-' + Date.now()
    const results = await scraper.scrapeAllSources(business_name, tempCompanyId)

    console.log('ScraperAPI test results:', results)

    const totalReviews = results.reduce((sum, result) => sum + result.reviewCount, 0)
    const successfulPlatforms = results.filter(result => result.success && result.reviewCount > 0)

    return NextResponse.json({
      success: true,
      business_name,
      total_reviews: totalReviews,
      successful_platforms: successfulPlatforms.map(p => ({
        platform: p.platform,
        review_count: p.reviewCount,
        success: p.success
      })),
      all_results: results,
      message: `ScraperAPI test completed. Found ${totalReviews} total reviews across ${successfulPlatforms.length} platforms.`
    })

  } catch (error) {
    console.error('ScraperAPI test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'ScraperAPI test failed'
      },
      { status: 500 }
    )
  }
} 