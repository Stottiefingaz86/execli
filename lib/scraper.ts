import puppeteer, { Browser } from 'puppeteer'
import { createClient } from '@supabase/supabase-js'
import { formatVOCPrompt, validateVOCReportData } from './ai-specification'

// Types for our scraper system
export interface ScrapedReview {
  source: string
  external_review_id: string
  reviewer_name?: string
  rating: number
  review_text: string
  review_date: string
  sentiment_score?: number
  sentiment_label?: 'positive' | 'negative' | 'neutral'
  topics?: string[]
}

export interface ScraperConfig {
  name: string
  baseUrl: string
  selectors: {
    reviewContainer: string
    reviewerName?: string
    rating?: string
    reviewText: string
    reviewDate?: string
    nextPage?: string
  }
  maxPages?: number
  delay?: number
}

// Universal scraper class
export class UniversalScraper {
  private browser: Browser | null = null

  async init() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    })
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
    }
  }

  async scrapeReviews(url: string, config: ScraperConfig): Promise<ScrapedReview[]> {
    if (!this.browser) {
      throw new Error('Browser not initialized')
    }

    const page = await this.browser.newPage()
    const reviews: ScrapedReview[] = []
    let currentPage = 1
    const maxPages = config.maxPages || 5

    try {
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

      while (currentPage <= maxPages) {
        const pageUrl = currentPage === 1 ? url : `${url}?page=${currentPage}`
        await page.goto(pageUrl, { waitUntil: 'networkidle2' })

        // Wait for reviews to load
        await page.waitForSelector(config.selectors.reviewContainer, { timeout: 10000 })

        // Extract reviews from current page
        const pageReviews = await page.evaluate((selectors: ScraperConfig['selectors']) => {
          const reviewElements = document.querySelectorAll(selectors.reviewContainer)
          return Array.from(reviewElements).map((element, index) => {
            const getText = (selector: string) => {
              const el = element.querySelector(selector)
              return el ? el.textContent?.trim() || '' : ''
            }

            const getRating = (selector: string) => {
              const el = element.querySelector(selector)
              if (!el) return 0
              
              // Handle different rating formats
              const text = el.textContent?.trim() || ''
              const ariaLabel = el.getAttribute('aria-label') || ''
              
              // Extract number from text like "4.5 stars" or "4.5/5"
              const match = (text + ariaLabel).match(/(\d+(?:\.\d+)?)/)
              return match ? Math.min(5, Math.max(1, parseFloat(match[1]))) : 0
            }

            const getDate = (selector: string) => {
              const el = element.querySelector(selector)
              if (!el) return new Date().toISOString().split('T')[0]
              
              const text = el.textContent?.trim() || ''
              // Try to parse various date formats
              const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/)
              if (dateMatch) {
                return new Date(dateMatch[0]).toISOString().split('T')[0]
              }
              
              return new Date().toISOString().split('T')[0]
            }

            return {
              external_review_id: `${config.name}_${Date.now()}_${index}`,
              reviewer_name: selectors.reviewerName ? getText(selectors.reviewerName) : 'Anonymous',
              rating: selectors.rating ? getRating(selectors.rating) : 0,
              review_text: getText(selectors.reviewText),
              review_date: selectors.reviewDate ? getDate(selectors.reviewDate) : new Date().toISOString().split('T')[0],
              source: config.name,
              sentiment_score: 0,
              sentiment_label: 'neutral' as const,
              topics: []
            }
          })
        }, config.selectors)

        reviews.push(...pageReviews)

        // Check if there's a next page
        if (config.selectors.nextPage) {
          const hasNextPage = await page.$(config.selectors.nextPage)
          if (!hasNextPage) break
        }

        currentPage++
        
        // Add delay between pages to be respectful
        if (config.delay) {
          await new Promise(resolve => setTimeout(resolve, config.delay))
        }
      }

    } catch (error) {
      console.error(`Error scraping ${config.name}:`, error)
    } finally {
      await page.close()
    }

    return reviews
  }
}

// Platform-specific configurations
export const SCRAPER_CONFIGS: Record<string, ScraperConfig> = {
  'Google Reviews': {
    name: 'Google Reviews',
    baseUrl: 'https://www.google.com/maps',
    selectors: {
      reviewContainer: '[data-review-id]',
      reviewerName: '[data-reviewer-name]',
      rating: '[aria-label*="stars"]',
      reviewText: '[data-review-text]',
      reviewDate: '[data-review-date]'
    },
    maxPages: 3,
    delay: 2000
  },
  'Yelp': {
    name: 'Yelp',
    baseUrl: 'https://www.yelp.com',
    selectors: {
      reviewContainer: '.review',
      reviewerName: '.reviewer-name',
      rating: '.stars',
      reviewText: '.review-content p',
      reviewDate: '.review-date'
    },
    maxPages: 5,
    delay: 1500
  },
  'Trustpilot': {
    name: 'Trustpilot',
    baseUrl: 'https://www.trustpilot.com',
    selectors: {
      reviewContainer: '[data-service-review-card]',
      reviewerName: '[data-service-review-card-username]',
      rating: '[data-service-review-rating]',
      reviewText: '[data-service-review-card-body]',
      reviewDate: '[data-service-review-card-date]'
    },
    maxPages: 3,
    delay: 2000
  },
  'TripAdvisor': {
    name: 'TripAdvisor',
    baseUrl: 'https://www.tripadvisor.com',
    selectors: {
      reviewContainer: '.review-container',
      reviewerName: '.reviewer-name',
      rating: '.stars',
      reviewText: '.review-content p',
      reviewDate: '.review-date'
    },
    maxPages: 3,
    delay: 2000
  }
}

// Main scraping workflow
export async function runScrapingWorkflow(
  companyId: string,
  businessName: string,
  businessUrl: string,
  industry: string,
  reviewSource: string,
  reviewUrl: string
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const scraper = new UniversalScraper()
  
  try {
    // Initialize scraper
    await scraper.init()
    
    // Get scraper config for the review source
    const config = SCRAPER_CONFIGS[reviewSource]
    if (!config) {
      throw new Error(`No scraper configuration found for ${reviewSource}`)
    }

    // Update company status to processing
    await supabase
      .from('companies')
      .update({ status: 'processing' })
      .eq('id', companyId)

    // Scrape reviews
    console.log(`Starting to scrape ${reviewSource} reviews...`)
    const scrapedReviews = await scraper.scrapeReviews(reviewUrl, config)
    
    if (scrapedReviews.length === 0) {
      throw new Error('No reviews found')
    }

    console.log(`Scraped ${scrapedReviews.length} reviews from ${reviewSource}`)

    // Analyze reviews with AI using our precise specification
    const analysisPrompt = formatVOCPrompt(
      scrapedReviews,
      businessName,
      businessUrl,
      industry,
      [reviewSource]
    )

    // Call your AI service (OpenAI, Anthropic, etc.)
    const analysisResult = await analyzeWithAI(analysisPrompt)
    
    // Store results in database
    await storeAnalysisResults(companyId, analysisResult, supabase)
    
    // Update company status to complete
    await supabase
      .from('companies')
      .update({ status: 'complete' })
      .eq('id', companyId)

    console.log(`Analysis complete for ${businessName}`)
    return { success: true, companyId }

  } catch (error) {
    console.error('Scraping workflow failed:', error)
    
    // Update company status to error
    await supabase
      .from('companies')
      .update({ status: 'error' })
      .eq('id', companyId)

    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  } finally {
    await scraper.close()
  }
}

// AI analysis function using our precise specification
async function analyzeWithAI(prompt: string) {
  try {
    // Choose ONE of these options:
    
    // Option 1: OpenAI (recommended)
    if (process.env.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          max_tokens: 6000 // Increased for larger reports
        })
      })
      
      const data = await response.json()
      if (data.error) {
        throw new Error(`OpenAI API error: ${data.error.message}`)
      }
      
      const result = JSON.parse(data.choices[0].message.content)
      
      // Validate the result matches our structure
      if (!validateVOCReportData(result)) {
        throw new Error('AI response does not match expected VOC report structure')
      }
      
      return result
    }
    
    // Option 2: Anthropic
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 6000,
          messages: [{ role: 'user', content: prompt }]
        })
      })
      
      const data = await response.json()
      if (data.error) {
        throw new Error(`Anthropic API error: ${data.error.message}`)
      }
      
      const result = JSON.parse(data.content[0].text)
      
      // Validate the result matches our structure
      if (!validateVOCReportData(result)) {
        throw new Error('AI response does not match expected VOC report structure')
      }
      
      return result
    }
    
    // If no AI service configured, return mock data that matches our structure
    console.warn('No AI service configured. Using mock data.')
    return {
      businessName: "Mock Business",
      businessUrl: "https://example.com",
      generatedAt: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      totalReviews: 150,
      dataSources: {
        current: [
          {
            name: "Google Reviews",
            status: "active",
            reviews: 150,
            lastSync: "2 hours ago",
            icon: "🔍"
          }
        ],
        available: [
          {
            name: "Trustpilot",
            price: 19,
            description: "Customer review platform",
            icon: "⭐"
          }
        ]
      },
      executiveSummary: {
        sentimentChange: "+12%",
        volumeChange: "+18%",
        mostPraised: "Customer service",
        topComplaint: "Slow delivery",
        overview: "Customer sentiment has improved this quarter, with customer service being the most praised aspect. However, delivery speed remains a concern that needs attention.",
        alerts: [
          {
            type: "warning",
            message: "Delivery complaints increased 15% this month",
            metric: "Delivery"
          },
          {
            type: "info",
            message: "Customer service satisfaction improved 25%",
            metric: "Service"
          }
        ]
      },
      keyInsights: [
        {
          insight: "Customer service satisfaction improved 25% this quarter",
          direction: "up",
          mentions: 45,
          platforms: ["Google Reviews"],
          impact: "high",
          reviews: [
            {
              text: "Amazing customer service, they really helped me out!",
              topic: "Customer Service",
              sentiment: "positive"
            },
            {
              text: "Great support team, very responsive",
              topic: "Customer Service",
              sentiment: "positive"
            },
            {
              text: "Excellent customer service experience",
              topic: "Customer Service",
              sentiment: "positive"
            }
          ]
        }
      ],
      sentimentOverTime: [
        { month: "Jan", business: 72, competitorA: 68, competitorB: 70, competitorC: 65 },
        { month: "Feb", business: 75, competitorA: 69, competitorB: 71, competitorC: 66 },
        { month: "Mar", business: 78, competitorA: 70, competitorB: 72, competitorC: 67 },
        { month: "Apr", business: 76, competitorA: 71, competitorB: 73, competitorC: 68 },
        { month: "May", business: 79, competitorA: 72, competitorB: 74, competitorC: 69 },
        { month: "Jun", business: 81, competitorA: 73, competitorB: 75, competitorC: 70 }
      ],
      mentionsByTopic: [
        { topic: "Customer Service", positive: 65, neutral: 20, negative: 15, total: 100 },
        { topic: "Product Quality", positive: 78, neutral: 15, negative: 7, total: 100 },
        { topic: "Delivery", positive: 45, neutral: 25, negative: 30, total: 100 },
        { topic: "Pricing", positive: 55, neutral: 30, negative: 15, total: 100 }
      ],
      trendingTopics: [
        { topic: "Customer Service", increase: "+15%", sources: ["Google Reviews"], sentiment: "positive" },
        { topic: "Delivery Speed", increase: "+8%", sources: ["Google Reviews"], sentiment: "negative" }
      ],
      volumeOverTime: [
        { week: "W1", volume: 45, platform: "Google" },
        { week: "W2", volume: 52, platform: "Google" },
        { week: "W3", volume: 48, platform: "Google" },
        { week: "W4", volume: 67, platform: "Google" },
        { week: "W5", volume: 58, platform: "Google" },
        { week: "W6", volume: 73, platform: "Google" },
        { week: "W7", volume: 62, platform: "Google" },
        { week: "W8", volume: 89, platform: "Google" }
      ],
      competitorComparison: [
        { topic: "Customer Service", business: 4.2, competitorA: 3.8, competitorB: 4.0, competitorC: 3.5 },
        { topic: "Product Quality", business: 4.1, competitorA: 3.9, competitorB: 4.2, competitorC: 3.7 },
        { topic: "Delivery", business: 3.5, competitorA: 3.9, competitorB: 3.8, competitorC: 4.0 }
      ],
      marketGaps: [
        { gap: "No same-day delivery option", mentions: 18, suggestion: "Partner with local delivery services" },
        { gap: "Limited payment options", mentions: 10, suggestion: "Add Apple Pay, PayPal" }
      ],
      advancedMetrics: {
        trustScore: 78,
        repeatComplaints: 12,
        avgResolutionTime: "2.3 days",
        vocVelocity: "+8%"
      },
      suggestedActions: [
        "Improve delivery speed with local partnerships",
        "Add more payment options for convenience",
        "Continue customer service training program"
      ],
      vocDigest: {
        summary: "This month: Customer service improved 25%, delivery complaints increased 15%, overall sentiment positive.",
        highlights: [
          "Customer service satisfaction up 25%",
          "Delivery speed needs improvement",
          "Overall sentiment trending positive"
        ]
      }
    }
    
  } catch (error) {
    console.error('AI analysis failed:', error)
    throw error
  }
}

// Store analysis results in database
async function storeAnalysisResults(companyId: string, analysisData: any, supabase: any) {
  try {
    // Store the complete analysis in the voc_reports table
    const { error: reportError } = await supabase
      .from('voc_reports')
      .update({
        analysis: analysisData,
        executive_summary: analysisData.executiveSummary,
        key_insights: analysisData.keyInsights,
        sentiment_over_time: analysisData.sentimentOverTime,
        mentions_by_topic: analysisData.mentionsByTopic,
        trending_topics: analysisData.trendingTopics,
        volume_over_time: analysisData.volumeOverTime,
        competitor_comparison: analysisData.competitorComparison,
        market_gaps: analysisData.marketGaps,
        advanced_metrics: analysisData.advancedMetrics,
        voc_digest: analysisData.vocDigest,
        suggested_actions: analysisData.suggestedActions,
        sources: analysisData.dataSources,
        processed_at: new Date().toISOString()
      })
      .eq('company_id', companyId)

    if (reportError) {
      console.error('Error storing analysis results:', reportError)
      throw reportError
    }

    console.log('Analysis results stored successfully in voc_reports table')
  } catch (error) {
    console.error('Error storing analysis results:', error)
    throw error
  }
} 