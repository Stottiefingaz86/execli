import { UniversalScraper, SCRAPER_CONFIGS } from './scraper'
import { supabase } from './supabase'

// Enhanced scraper that can detect and scrape from multiple platforms
export class MultiPlatformScraper {
  private scraper: UniversalScraper

  constructor() {
    this.scraper = new UniversalScraper()
  }

  async init() {
    await this.scraper.init()
  }

  async close() {
    await this.scraper.close()
  }

  // Detect which platforms have reviews for a business
  async detectReviewPlatforms(businessName: string, businessUrl: string): Promise<{
    platform: string
    detected: boolean
    reviewUrl?: string
    estimatedReviews?: number
  }[]> {
    const results = []
    
    for (const [platformName, config] of Object.entries(SCRAPER_CONFIGS)) {
      try {
        // Try to construct review URLs for each platform
        const reviewUrl = await this.constructReviewUrl(platformName, businessName, businessUrl)
        
        if (reviewUrl) {
          // Quick check if the page exists and has reviews
          const hasReviews = await this.checkForReviews(reviewUrl, config)
          
          results.push({
            platform: platformName,
            detected: hasReviews,
            reviewUrl: hasReviews ? reviewUrl : undefined,
            estimatedReviews: hasReviews ? await this.estimateReviewCount(reviewUrl, config) : 0
          })
        }
      } catch (error) {
        console.log(`Error detecting ${platformName}:`, error instanceof Error ? error.message : 'Unknown error')
        results.push({
          platform: platformName,
          detected: false
        })
      }
    }
    
    return results
  }

  // Construct review URLs for different platforms
  private async constructReviewUrl(platform: string, businessName: string, businessUrl: string): Promise<string | null> {
    const domain = new URL(businessUrl).hostname.replace('www.', '')
    
    switch (platform) {
      case 'Google Reviews':
        // Try to find Google Maps listing
        return `https://www.google.com/maps/search/${encodeURIComponent(businessName)}`
      
      case 'Yelp':
        return `https://www.yelp.com/biz/${this.slugify(businessName)}`
      
      case 'Trustpilot':
        return `https://www.trustpilot.com/review/${domain}`
      
      case 'TripAdvisor':
        return `https://www.tripadvisor.com/Search?q=${encodeURIComponent(businessName)}`
      
      default:
        return null
    }
  }

  // Check if a URL has reviews
  private async checkForReviews(url: string, config: any): Promise<boolean> {
    try {
      const page = await this.scraper['browser']?.newPage()
      if (!page) return false
      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 })
      
      // Look for review indicators
      const hasReviews = await page.evaluate(() => {
        const reviewSelectors = [
          '[data-review-id]',
          '.review',
          '[data-service-review-card]',
          '.review-container',
          '.rating',
          '.stars'
        ]
        
        return reviewSelectors.some(selector => 
          document.querySelector(selector) !== null
        )
      })
      
      await page.close()
      return hasReviews
    } catch (error) {
      return false
    }
  }

  // Estimate number of reviews
  private async estimateReviewCount(url: string, config: any): Promise<number> {
    try {
      const page = await this.scraper['browser']?.newPage()
      if (!page) return 0
      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 })
      
      const count = await page.evaluate(() => {
        // Look for review count indicators
        const countSelectors = [
          '[data-review-count]',
          '.review-count',
          '.rating-count',
          '.total-reviews'
        ]
        
        for (const selector of countSelectors) {
          const element = document.querySelector(selector)
          if (element) {
            const text = element.textContent || ''
            const match = text.match(/(\d+)/)
            if (match) return parseInt(match[1])
          }
        }
        
        return 0
      })
      
      await page.close()
      return count
    } catch (error) {
      return 0
    }
  }

  // Scrape reviews from all detected platforms
  async scrapeAllPlatforms(
    companyId: string,
    businessName: string,
    businessUrl: string,
    userPlan: 'free' | 'paid' | 'premium' = 'free'
  ): Promise<{
    scrapedPlatforms: string[]
    totalReviews: number
    platformResults: Array<{
      platform: string
      success: boolean
      reviewCount: number
      error?: string
    }>
  }> {
    // Detect available platforms
    const detectedPlatforms = await this.detectReviewPlatforms(businessName, businessUrl)
    const availablePlatforms = detectedPlatforms.filter(p => p.detected)
    
    // Determine which platforms to scrape based on user plan
    const platformsToScrape = this.getPlatformsForPlan(availablePlatforms, userPlan)
    
    const results = []
    let totalReviews = 0
    
    // Scrape each platform
    for (const platform of platformsToScrape) {
      try {
        const config = SCRAPER_CONFIGS[platform.platform]
        const reviews = await this.scraper.scrapeReviews(platform.reviewUrl!, config)
        
        // Store reviews in database
        await this.storeReviews(companyId, reviews)
        
        results.push({
          platform: platform.platform,
          success: true,
          reviewCount: reviews.length
        })
        
        totalReviews += reviews.length
        
      } catch (error) {
        results.push({
          platform: platform.platform,
          success: false,
          reviewCount: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    return {
      scrapedPlatforms: platformsToScrape.map(p => p.platform),
      totalReviews,
      platformResults: results
    }
  }

  // Determine which platforms to scrape based on user plan
  private getPlatformsForPlan(
    availablePlatforms: Array<{ platform: string; detected: boolean; reviewUrl?: string }>,
    userPlan: 'free' | 'paid' | 'premium'
  ): Array<{ platform: string; reviewUrl: string }> {
    const platforms = availablePlatforms
      .filter(p => p.detected && p.reviewUrl)
      .map(p => ({ platform: p.platform, reviewUrl: p.reviewUrl! }))
    
    switch (userPlan) {
      case 'free':
        return platforms.slice(0, 1) // 1 platform free
      case 'paid':
        return platforms.slice(0, 2) // 2 platforms paid
      case 'premium':
        return platforms // All platforms premium
      default:
        return platforms.slice(0, 1)
    }
  }

  // Store reviews in database
  private async storeReviews(companyId: string, reviews: any[]) {
    if (reviews.length === 0) return
    
    const { error } = await supabase()
      .from('reviews')
      .insert(reviews.map(review => ({
        ...review,
        company_id: companyId
      })))
    
    if (error) {
      console.error('Error storing reviews:', error)
    }
  }

  // Helper function to create URL slugs
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

// Plan limits and pricing
export const PLAN_LIMITS = {
  free: {
    platforms: 1,
    price: 0,
    features: ['Basic VOC analysis', '1 platform', 'Email support']
  },
  paid: {
    platforms: 2,
    price: 19,
    features: ['Advanced VOC analysis', '2 platforms', 'Priority support', 'Export reports']
  },
  premium: {
    platforms: 'unlimited',
    price: 49,
    features: ['All platforms', 'Real-time monitoring', 'API access', 'Custom integrations']
  }
}

// Get upgrade suggestions based on detected platforms
export function getUpgradeSuggestions(detectedPlatforms: string[], currentPlan: 'free' | 'paid' | 'premium') {
  const suggestions = []
  
  if (currentPlan === 'free' && detectedPlatforms.length > 1) {
    suggestions.push({
      type: 'upgrade',
      message: `We found reviews on ${detectedPlatforms.length} platforms! Upgrade to see all sources.`,
      platforms: detectedPlatforms.slice(1),
      upgradeTo: 'paid'
    })
  }
  
  if (currentPlan === 'paid' && detectedPlatforms.length > 2) {
    suggestions.push({
      type: 'upgrade',
      message: `We found reviews on ${detectedPlatforms.length} platforms! Upgrade to premium for unlimited access.`,
      platforms: detectedPlatforms.slice(2),
      upgradeTo: 'premium'
    })
  }
  
  return suggestions
} 