import { UniversalScraper, SCRAPER_CONFIGS } from './scraper'
import { createClient } from '@supabase/supabase-js'
import puppeteer from 'puppeteer'
import fs from 'fs'

// Enhanced scraper with AI-powered source discovery
export class EnhancedVOCScraper {
  private scraper: UniversalScraper
  private browser: any

  constructor() {
    this.scraper = new UniversalScraper()
  }

  async init() {
    // Launch browser with more stable options to prevent protocol errors
    this.browser = await puppeteer.launch({
      headless: true, // Use headless mode for better stability
      slowMo: 50, // Reduced slowMo for better performance
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    })
    this.scraper['browser'] = this.browser
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
    }
  }

  // Always check all major review platforms for a business
  async detectAllReviewSources(businessName: string, businessUrl: string): Promise<{
    platform: string
    detected: boolean
    reviewUrl?: string
    estimatedReviews?: number
    hasRealData: boolean
  }[]> {
    const results: any[] = []
    
    // Always check these major platforms
    const platformsToCheck = [
      'Google Reviews',
      'Yelp', 
      'Trustpilot',
      'TripAdvisor',
      'Sitejabber',
      'BBB',
      'Reddit',
      'Facebook Reviews'
    ]
    
    for (const platformName of platformsToCheck) {
      try {
        const reviewUrl = await this.constructReviewUrl(platformName, businessName, businessUrl)
        
        if (reviewUrl) {
          const hasReviews = await this.checkForReviews(reviewUrl, platformName)
          const estimatedCount = hasReviews ? await this.estimateReviewCount(reviewUrl, platformName) : 0
          const hasRealData = hasReviews && estimatedCount > 0
          
          results.push({
            platform: platformName,
            detected: hasReviews,
            reviewUrl: hasRealData ? reviewUrl : undefined,
            estimatedReviews: estimatedCount,
            hasRealData
          })
        } else {
          results.push({
            platform: platformName,
            detected: false,
            hasRealData: false
          })
        }
      } catch (error) {
        console.log(`Error detecting ${platformName}:`, error instanceof Error ? error.message : 'Unknown error')
        results.push({
          platform: platformName,
          detected: false,
          hasRealData: false
        })
      }
    }
    
    return results
  }

  // Use AI to discover additional review URLs
  async discoverAdditionalSources(businessName: string, businessUrl: string): Promise<{
    platform: string
    reviewUrl: string
    estimatedReviews?: number
  }[]> {
    try {
      // Use OpenAI to search for additional review sources
      const searchPrompt = `Find all URLs where "${businessName}" is reviewed or discussed. Focus on review platforms, forums, and social media. Return only valid URLs with reviews.`
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that finds review URLs for businesses. Return only valid URLs where the business is actually reviewed.'
            },
            {
              role: 'user',
              content: searchPrompt
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        })
      })

      if (!response.ok) {
        console.log('OpenAI API error, skipping AI discovery')
        return []
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content || ''
      
      // Extract URLs from AI response
      const urls = content.match(/https?:\/\/[^\s]+/g) || []
      
      const discoveredSources = []
      
      for (const url of urls) {
        try {
          // Check if URL has reviews
          const hasReviews = await this.checkForReviews(url, 'discovered')
          if (hasReviews) {
            const estimatedCount = await this.estimateReviewCount(url, 'discovered')
            if (estimatedCount > 0) {
              discoveredSources.push({
                platform: this.extractPlatformFromUrl(url),
                reviewUrl: url,
                estimatedReviews: estimatedCount
              })
            }
          }
        } catch (error) {
          console.log(`Error checking discovered URL ${url}:`, error)
        }
      }
      
      return discoveredSources
    } catch (error) {
      console.log('Error in AI discovery:', error)
      return []
    }
  }

  // Construct review URLs for different platforms
  private async constructReviewUrl(platform: string, businessName: string, businessUrl: string): Promise<string | null> {
    const domain = new URL(businessUrl).hostname.replace('www.', '')
    const cleanBusinessName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    switch (platform) {
      case 'Google Reviews':
        return `https://www.google.com/maps/search/${encodeURIComponent(businessName)}`
      
      case 'Yelp':
        return `https://www.yelp.com/biz/${this.slugify(businessName)}`
      
      case 'Trustpilot':
        return `https://www.trustpilot.com/review/${domain}`
      
      case 'TripAdvisor':
        return `https://www.tripadvisor.com/Search?q=${encodeURIComponent(businessName)}`
      
      case 'Sitejabber':
        return `https://www.sitejabber.com/reviews/${domain}`
      
      case 'BBB':
        return `https://www.bbb.org/us/search?find_text=${encodeURIComponent(businessName)}`
      
      case 'Reddit':
        return `https://www.reddit.com/search/?q=${encodeURIComponent(businessName)}&restrict_sr=off&sort=relevance&t=all`
      
      case 'Facebook Reviews':
        return `https://www.facebook.com/pages/category/Local-Business/${cleanBusinessName}`
      
      default:
        return null
    }
  }

  // Check if a URL has reviews
  private async checkForReviews(url: string, platform: string): Promise<boolean> {
    console.log('checkForReviews called for platform:', platform, 'url:', url)
    // Force Trustpilot logic for any platform containing 'trustpilot'
    if (platform && platform.toLowerCase().includes('trustpilot')) {
      console.log('Trustpilot pagination: platform string is', platform)
      let totalReviewCount = 0;
      for (let pageNum = 1; pageNum <= 3; pageNum++) {
        const pageUrl = pageNum === 1 ? url : `${url}?page=${pageNum}`;
        console.log(`Visiting Trustpilot page ${pageNum}: ${pageUrl}`)
        const page = await this.scraper['browser']?.newPage();
        if (!page) continue;
        await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 20000 });
        // Accept cookies if present
        try {
          await page.waitForSelector('button#onetrust-accept-btn-handler, button[aria-label="Accept all cookies"], button[title*="Accept"]', { timeout: 5000 })
          await page.evaluate(() => {
            const btn = document.querySelector('button#onetrust-accept-btn-handler, button[aria-label="Accept all cookies"], button[title*="Accept"]') as HTMLElement
            if (btn) btn.click()
          })
          await new Promise(resolve => setTimeout(resolve, 1500))
        } catch (e) {}
        // Scroll to bottom
        await page.evaluate(async () => {
          await new Promise<void>((resolve) => {
            let totalHeight = 0;
            const distance = 200;
            const timer = setInterval(() => {
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= document.body.scrollHeight) {
                clearInterval(timer);
                resolve();
              }
            }, 200);
          });
        });
        await new Promise(resolve => setTimeout(resolve, 3000));
        // Take screenshot of first page only
        if (pageNum === 1) {
          try {
            await page.screenshot({ path: 'trustpilot_debug.png', fullPage: true })
          } catch (err) {
            console.error('Error writing trustpilot_debug.png:', err)
          }
          try {
            const html = await page.content()
            require('fs').writeFileSync('trustpilot_debug.html', html)
          } catch (err) {
            console.error('Error writing trustpilot_debug.html:', err)
            const reviewCardHtml = await page.evaluate(() => {
              const el = document.querySelector('[data-service-review-card], [class*="reviewCard"], .review-card');
              return el ? el.outerHTML : 'No review card found';
            });
            console.log('Sample review card HTML:', reviewCardHtml)
          }
        }
        // Review selectors
        const reviewSelectors = [
          '[data-service-review-card]',
          '[class*="reviewCard"]',
          '.styles_reviewCard__hcAvl',
          '.review-card'
        ];
        // Count reviews on this page
        const reviewCount = await page.evaluate((selectors) => {
          let count = 0;
          selectors.forEach(selector => {
            count += document.querySelectorAll(selector).length;
          });
          return count;
        }, reviewSelectors);
        console.log(`Trustpilot page ${pageNum} review count:`, reviewCount)
        totalReviewCount += reviewCount;
        // Log selector debug for first page
        if (pageNum === 1) {
          const found = await page.evaluate((selectors) => {
            return selectors.map(selector => ({
              selector,
              count: document.querySelectorAll(selector).length
            }));
          }, reviewSelectors);
          try {
            require('fs').writeFileSync('trustpilot_debug_selectors.json', JSON.stringify(found, null, 2))
          } catch (err) {
            console.error('Error writing trustpilot_debug_selectors.json:', err)
            console.log('Selector debug:', found)
          }
        }
        await page.close();
      }
      console.log('Trustpilot total review count (all pages):', totalReviewCount)
      return totalReviewCount > 0;
    } else {
      try {
        const page = await this.scraper['browser']?.newPage()
        if (!page) return false
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 })

        // For Trustpilot, scroll and take screenshot for debugging
        if (platform === 'Trustpilot') {
          // Try to accept cookies if popup is present
          try {
            await page.waitForSelector('button#onetrust-accept-btn-handler, button[aria-label="Accept all cookies"], button[title*="Accept"]', { timeout: 5000 })
            await page.evaluate(() => {
              const btn = document.querySelector('button#onetrust-accept-btn-handler, button[aria-label="Accept all cookies"], button[title*="Accept"]') as HTMLElement
              if (btn) btn.click()
            })
            await new Promise(resolve => setTimeout(resolve, 1500))
          } catch (e) {}
          // Scroll to bottom to trigger lazy loading
          await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
              let totalHeight = 0;
              const distance = 200;
              const timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= document.body.scrollHeight) {
                  clearInterval(timer);
                  resolve();
                }
              }, 200);
            });
          });
          await new Promise(resolve => setTimeout(resolve, 3000));
          // Take screenshot
          try {
            await page.screenshot({ path: 'trustpilot_debug.png', fullPage: true })
          } catch (err) {
            console.error('Error writing trustpilot_debug.png:', err)
          }
          // Log HTML for debugging
          try {
            const html = await page.content()
            require('fs').writeFileSync('trustpilot_debug.html', html)
          } catch (err) {
            console.error('Error writing trustpilot_debug.html:', err)
            // Print a review card HTML to terminal
            const reviewCardHtml = await page.evaluate(() => {
              const el = document.querySelector('[data-service-review-card], [class*="reviewCard"], .review-card');
              return el ? el.outerHTML : 'No review card found';
            });
            console.log('Sample review card HTML:', reviewCardHtml)
          }
        }

        // Platform-specific review indicators
        const reviewSelectors = {
          'Google Reviews': ['[data-review-id]', '.review', '.g88MCb'],
          'Yelp': ['.review', '.review-content', '[data-review-id]'],
          'Trustpilot': ['[data-service-review-card]', '.review-card', '.styles_reviewCard__hcAvl'],
          'TripAdvisor': ['.review-container', '.review', '.ui_column'],
          'Sitejabber': ['.review', '.review-content'],
          'BBB': ['.review', '.rating'],
          'Reddit': ['.comment', '.Post'],
          'Facebook Reviews': ['.review', '.rating'],
          'discovered': ['.review', '[data-review]', '.rating', '.comment']
        }
        const selectors = reviewSelectors[platform as keyof typeof reviewSelectors] || reviewSelectors.discovered

        // Debug: log which selectors match
        const hasReviews = await page.evaluate((selectors) => {
          const found = selectors.map(selector => ({
            selector,
            count: document.querySelectorAll(selector).length
          }))
          // @ts-ignore
          window.__VOC_DEBUG_FOUND = found
          return found.some(f => f.count > 0)
        }, selectors)

        // Log selector results for debugging
        const found = await page.evaluate(() => (window as any)['__VOC_DEBUG_FOUND'] as any[])
        if (platform === 'Trustpilot') {
          try {
            require('fs').writeFileSync('trustpilot_debug_selectors.json', JSON.stringify(found, null, 2))
          } catch (err) {
            console.error('Error writing trustpilot_debug_selectors.json:', err)
            console.log('Selector debug:', found)
          }
        }

        await page.close()
        return hasReviews
      } catch (error) {
        console.error('Error in checkForReviews:', error)
        return false
      }
    }
  }

  // Estimate number of reviews
  private async estimateReviewCount(url: string, platform: string): Promise<number> {
    try {
      const page = await this.scraper['browser']?.newPage()
      if (!page) return 0
      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 })
      
      const count = await page.evaluate((platform) => {
        // Platform-specific review count selectors
        const countSelectors = {
          'Google Reviews': ['[data-review-count]', '.review-count', '.g88MCb'],
          'Yelp': ['.review-count', '.total-reviews'],
          'Trustpilot': ['.review-count', '.total-reviews'],
          'TripAdvisor': ['.review-count', '.total-reviews'],
          'Sitejabber': ['.review-count', '.total-reviews'],
          'BBB': ['.review-count', '.rating-count'],
          'Reddit': ['.comment-count', '.Post'],
          'Facebook Reviews': ['.review-count', '.rating-count'],
          'discovered': ['.review-count', '.total-reviews', '.comment-count']
        }
        
        const selectors = countSelectors[platform as keyof typeof countSelectors] || countSelectors.discovered
        
        for (const selector of selectors) {
          const element = document.querySelector(selector)
          if (element) {
            const text = element.textContent || ''
            const match = text.match(/(\d+)/)
            if (match) return parseInt(match[1])
          }
        }
        
        // Fallback: count visible review elements
        const reviewElements = document.querySelectorAll('.review, [data-review], .comment')
        return reviewElements.length
      }, platform)
      
      await page.close()
      return count
    } catch (error) {
      return 0
    }
  }

  // Extract platform name from URL
  private extractPlatformFromUrl(url: string): string {
    const hostname = new URL(url).hostname.toLowerCase()
    
    if (hostname.includes('google')) return 'Google Reviews'
    if (hostname.includes('yelp')) return 'Yelp'
    if (hostname.includes('trustpilot')) return 'Trustpilot'
    if (hostname.includes('tripadvisor')) return 'TripAdvisor'
    if (hostname.includes('sitejabber')) return 'Sitejabber'
    if (hostname.includes('bbb.org')) return 'BBB'
    if (hostname.includes('reddit')) return 'Reddit'
    if (hostname.includes('facebook')) return 'Facebook Reviews'
    
    return 'Other'
  }

  // --- REDDIT ENHANCEMENT: Use Google search to find all Reddit threads mentioning the brand ---
  async findRedditThreadsViaGoogle(brand: string): Promise<string[]> {
    const page = await this.browser.newPage();
    await page.goto(`https://www.google.com/search?q=site:reddit.com+${encodeURIComponent(brand)}`);
    await page.waitForSelector('a');
    const urls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .map(a => a.href)
        .filter(href => href.includes('reddit.com/r/') && href.includes('/comments/'));
    });
    await page.close();
    return Array.from(new Set(urls));
  }

  // --- REDDIT SCRAPING: Scrape comments from each thread ---
  async scrapeRedditThread(threadUrl: string): Promise<any[]> {
    const page = await this.browser.newPage();
    await page.goto(threadUrl, { waitUntil: 'networkidle2', timeout: 20000 });
    await page.waitForSelector('h1, h2, .Post', { timeout: 10000 });
    // Extract top-level comments
    const comments = await page.evaluate(() => {
      const commentBlocks = document.querySelectorAll('[data-test-id="comment"]') as NodeListOf<HTMLElement>;
      return Array.from(commentBlocks).map(block => {
        const text = (block as HTMLElement).innerText || '';
        const upvotes = (block.querySelector('[id^="vote-arrows"]') as HTMLElement)?.textContent || '';
        const date = (block.querySelector('a[data-click-id="timestamp"]') as HTMLElement)?.textContent || '';
        return { text, upvotes, date };
      });
    });
    await page.close();
    return comments;
  }

  // Scrape reviews from all detected platforms with real data
  async scrapeAllSourcesWithData(
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
    // Detect all available platforms
    const detectedPlatforms = await this.detectAllReviewSources(businessName, businessUrl)
    
    // Discover additional sources via AI
    const discoveredSources = await this.discoverAdditionalSources(businessName, businessUrl)
    
    // Combine and filter sources with real data
    const allSources = [
      ...detectedPlatforms.filter(p => p.hasRealData),
      ...discoveredSources.map(s => ({
        platform: s.platform,
        detected: true,
        reviewUrl: s.reviewUrl,
        estimatedReviews: s.estimatedReviews,
        hasRealData: true
      }))
    ]
    
    // Determine which platforms to scrape based on user plan
    const platformsToScrape = this.getPlatformsForPlan(allSources, userPlan)
    
    const results: Array<{ platform: string; success: boolean; reviewCount: number; error?: string }> = []
    let totalReviews = 0
    
    // Scrape each platform
    for (const platform of platformsToScrape as Array<{ platform: string; reviewUrl: string }>) {
      try {
        const config = SCRAPER_CONFIGS[platform.platform] || {
          name: platform.platform,
          baseUrl: '',
          selectors: {
            reviewContainer: '.review, [data-review], .comment',
            reviewText: '.review-text, .comment-text, p',
            rating: '.rating, .stars',
            reviewerName: '.reviewer-name, .author',
            reviewDate: '.review-date, .date'
          }
        }
        
        const reviews = await this.scraper.scrapeReviews(platform.reviewUrl!, config)
        
        // Store reviews in database
        await this.storeReviews(companyId, reviews)
        
        results.push({
          platform: (platform as { platform: string }).platform,
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
    availablePlatforms: Array<{ platform: string; detected: boolean; reviewUrl?: string; hasRealData: boolean }>,
    userPlan: 'free' | 'paid' | 'premium'
  ): Array<{ platform: string; reviewUrl: string }> {
    const platforms = availablePlatforms
      .filter(p => p.detected && p.reviewUrl && p.hasRealData)
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
    
    // Get Supabase client with proper error handling
    const supabase = this.getSupabaseClient()
    if (!supabase) {
      console.log(`Test mode: Would store ${reviews.length} reviews for company ${companyId}`)
      return
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert(reviews.map(review => ({
          ...review,
          company_id: companyId
        })))
      
      if (error) {
        console.error('Error storing reviews:', error)
      } else {
        console.log(`Stored ${reviews.length} reviews for company ${companyId}`)
      }
    } catch (error) {
      console.error('Error storing reviews:', error)
    }
  }

  // Get Supabase client only when needed
  private getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('Supabase not configured - running in test mode')
      return null
    }
    
    return createClient(supabaseUrl, supabaseKey)
  }

  // Helper function to create URL slugs
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
} 