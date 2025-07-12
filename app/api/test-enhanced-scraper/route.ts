import { NextRequest, NextResponse } from 'next/server'
import { EnhancedVOCScraper } from '../../../lib/enhanced-scraper'

export async function POST(request: NextRequest) {
  const scraper = new EnhancedVOCScraper()
  
  try {
    await scraper.init()
    
    const body = await request.json()
    const { business_name, business_url } = body

    if (!business_name || !business_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Testing enhanced scraper for:', { business_name, business_url })

    // Test source detection
    const detectedSources = await scraper.detectAllReviewSources(business_name, business_url)
    console.log('Detected sources:', detectedSources)

    // Test AI discovery
    const discoveredSources = await scraper.discoverAdditionalSources(business_name, business_url)
    console.log('Discovered sources:', discoveredSources)

    // Only include sources with real data
    const sourcesWithRealData = detectedSources.filter(source => source.hasRealData)
    const allSourcesWithData = [
      ...sourcesWithRealData,
      ...discoveredSources.map(s => ({
        platform: s.platform,
        detected: true,
        reviewUrl: s.reviewUrl,
        estimatedReviews: s.estimatedReviews,
        hasRealData: true
      }))
    ]

    return NextResponse.json({
      success: true,
      detected_sources: detectedSources,
      discovered_sources: discoveredSources,
      sources_with_real_data: allSourcesWithData,
      total_sources_with_data: allSourcesWithData.length
    })
  } catch (error) {
    console.error('Test enhanced scraper error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await scraper.close()
  }
} 