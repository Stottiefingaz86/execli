import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { business_name, business_url } = body

    if (!business_name || !business_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Simulate platform detection with realistic data
    const detectedPlatforms = [
      {
        name: 'Google Reviews',
        icon: '🔍',
        reviews: Math.floor(Math.random() * 50) + 20,
        detected: true,
        description: 'Google Business reviews',
        price: 0, // Free tier
        url: `https://www.google.com/search?q=${encodeURIComponent(business_name)}`
      },
      {
        name: 'Yelp',
        icon: '🍽️',
        reviews: Math.floor(Math.random() * 30) + 10,
        detected: true,
        description: 'Local business reviews',
        price: 19,
        url: `https://www.yelp.com/search?find_desc=${encodeURIComponent(business_name)}`
      },
      {
        name: 'Trustpilot',
        icon: '⭐',
        reviews: Math.floor(Math.random() * 25) + 5,
        detected: true,
        description: 'Customer review platform',
        price: 19,
        url: `https://www.trustpilot.com/search?query=${encodeURIComponent(business_name)}`
      },
      {
        name: 'Facebook',
        icon: '📘',
        reviews: Math.floor(Math.random() * 15) + 3,
        detected: Math.random() > 0.3, // 70% chance of detection
        description: 'Social media reviews',
        price: 19,
        url: `https://www.facebook.com/search/top/?q=${encodeURIComponent(business_name)}`
      },
      {
        name: 'TripAdvisor',
        icon: '🦉',
        reviews: Math.floor(Math.random() * 20) + 2,
        detected: Math.random() > 0.5, // 50% chance of detection
        description: 'Travel and attraction reviews',
        price: 24,
        url: `https://www.tripadvisor.com/Search?q=${encodeURIComponent(business_name)}`
      },
      {
        name: 'Amazon',
        icon: '📦',
        reviews: Math.floor(Math.random() * 40) + 5,
        detected: Math.random() > 0.4, // 60% chance of detection
        description: 'Product reviews and ratings',
        price: 34,
        url: `https://www.amazon.com/s?k=${encodeURIComponent(business_name)}`
      }
    ].filter(platform => platform.detected)

    return NextResponse.json({
      success: true,
      business_name,
      business_url,
      detected_platforms: detectedPlatforms,
      total_platforms: detectedPlatforms.length,
      free_tier_limit: 1
    })

  } catch (error) {
    console.error('Platform detection error:', error)
    return NextResponse.json(
      { error: 'Platform detection failed' },
      { status: 500 }
    )
  }
} 