import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

interface Review {
  text: string;
  rating?: number;
  date?: string;
  source: string;
  url?: string;
  author?: string;
}

interface ScrapingResult {
  platform: string;
  success: boolean;
  reviews: Review[];
  reviewCount: number;
  error?: string;
}

export class ScraperAPIVOCScraper {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.SCRAPERAPI_API_KEY!;
    
    if (!this.apiKey) {
      throw new Error('SCRAPERAPI_API_KEY is required');
    }
  }

  // Get Supabase client only when needed
  private getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('Supabase not configured - running in test mode');
      return null;
    }
    
    return createClient(supabaseUrl, supabaseServiceKey);
  }

  // Main method to scrape all sources for a business
  async scrapeAllSources(businessName: string, companyId: string): Promise<ScrapingResult[]> {
    console.log(`Starting ScraperAPI scraping for: ${businessName}`);
    
    const results: ScrapingResult[] = [];
    
    // --- AI/Google-based Trustpilot URL discovery ---
    let trustpilotUrl = await this.findTrustpilotUrl(businessName);
    if (!trustpilotUrl) {
      trustpilotUrl = `https://www.trustpilot.com/review/${businessName}`;
    }
    const platforms = [
      { name: 'Trustpilot', url: trustpilotUrl },
      { name: 'Google', url: `https://www.google.com/search?q=${encodeURIComponent(businessName + ' reviews')}` },
      { name: 'Yelp', url: `https://www.yelp.com/search?find_desc=${encodeURIComponent(businessName)}` },
      { name: 'Reddit', url: `https://www.reddit.com/search/?q=${encodeURIComponent(businessName + ' review')}` },
      { name: 'TripAdvisor', url: `https://www.tripadvisor.com/Search?q=${encodeURIComponent(businessName)}` }
    ];

    // Scrape each platform
    for (const platform of platforms) {
      try {
        console.log(`Scraping ${platform.name}...`);
        const result = await this.scrapePlatform(platform.name, platform.url, businessName);
        results.push(result);
        
        // Store reviews if successful
        if (result.success && result.reviews.length > 0) {
          await this.storeReviews(companyId, result.reviews);
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error scraping ${platform.name}:`, error);
        results.push({
          platform: platform.name,
          success: false,
          reviews: [],
          reviewCount: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  // Main method to scrape all sources for a business with progress updates
  async scrapeAllSourcesWithProgress(businessName: string, companyId: string, reportId: string, businessUrl?: string): Promise<ScrapingResult[]> {
    console.log(`Starting ScraperAPI scraping for: ${businessName}`);
    const results: ScrapingResult[] = [];

    // --- AI/Google-based Trustpilot URL discovery ---
    let trustpilotUrl = await this.findTrustpilotUrl(businessName, businessUrl);
    if (!trustpilotUrl) {
      trustpilotUrl = `https://www.trustpilot.com/review/${businessName}`;
    }
    const platforms = [
      { name: 'Trustpilot', url: trustpilotUrl },
      { name: 'Google', url: `https://www.google.com/search?q=${encodeURIComponent(businessName + ' reviews')}` },
      { name: 'Yelp', url: `https://www.yelp.com/search?find_desc=${encodeURIComponent(businessName)}` },
      { name: 'Reddit', url: `https://www.reddit.com/search/?q=${encodeURIComponent(businessName + ' review')}` },
      { name: 'TripAdvisor', url: `https://www.tripadvisor.com/Search?q=${encodeURIComponent(businessName)}` }
    ];

    // Update progress for each platform
    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i];
      const progressMessage = `🔍 Scraping ${platform.name}... (${i + 1}/${platforms.length})`;
      
      try {
        // Update progress in database
        const supabase = this.getSupabaseClient();
        if (supabase) {
          await supabase
            .from('voc_reports')
            .update({ progress_message: progressMessage })
            .eq('id', reportId);
        }
        
        console.log(`Scraping ${platform.name}...`);
        const result = await this.scrapePlatform(platform.name, platform.url, businessName);
        results.push(result);
        
        // Add small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error scraping ${platform.name}:`, error);
        results.push({
          platform: platform.name,
          success: false,
          reviews: [],
          reviewCount: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  // Scrape a specific platform
  async scrapePlatform(platform: string, url: string, businessName: string): Promise<ScrapingResult> {
    try {
      // Build ScraperAPI URL
      const scraperUrl = `http://api.scraperapi.com?api_key=${this.apiKey}&url=${encodeURIComponent(url)}&render=true`;
      
      console.log(`Making request to ScraperAPI for ${platform}: ${url}`);
      
      const response = await fetch(scraperUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`ScraperAPI request failed: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      console.log(`Received ${html.length} characters from ${platform}`);

      // --- Save HTML for debugging ---
      try {
        const debugPath = path.join(process.cwd(), `debug_${platform.toLowerCase()}.html`);
        fs.writeFileSync(debugPath, html);
        console.log(`Saved raw HTML for ${platform} to ${debugPath}`);
      } catch (err) {
        console.error(`Failed to save debug HTML for ${platform}:`, err);
      }
      // --- End save HTML ---

      // Parse reviews based on platform
      const reviews = await this.parseReviews(platform, html, businessName);
      
      return {
        platform,
        success: true,
        reviews,
        reviewCount: reviews.length
      };

    } catch (error) {
      console.error(`Error scraping ${platform}:`, error);
      return {
        platform,
        success: false,
        reviews: [],
        reviewCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Parse reviews based on platform
  async parseReviews(platform: string, html: string, businessName: string): Promise<Review[]> {
    const reviews: Review[] = []
    
    try {
      switch (platform.toLowerCase()) {
        case 'trustpilot':
          reviews.push(...this.parseTrustpilotReviews(html))
          break
        case 'google':
          reviews.push(...this.parseGoogleReviews(html))
          break
        case 'reddit':
          reviews.push(...this.parseRedditReviews(html))
          break
        case 'yelp':
          reviews.push(...this.parseYelpReviews(html))
          break
        case 'tripadvisor':
          reviews.push(...this.parseTripAdvisorReviews(html))
          break
        default:
          // Generic parsing for unknown platforms
          reviews.push(...this.parseGenericReviews(html, platform))
      }
    } catch (error) {
      console.error(`Error parsing ${platform} reviews:`, error)
    }
    
    console.log(`Parsed ${reviews.length} reviews from ${platform}`)
    return reviews
  }

  // --- AI/Google-based Trustpilot URL discovery ---
  async findTrustpilotUrl(businessName: string, businessUrl?: string): Promise<string | null> {
    try {
      // 1. Try domain-based Trustpilot URL first
      let domain = '';
      if (businessUrl) {
        try {
          domain = businessUrl.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
        } catch {}
      }
      if (domain) {
        const trustpilotDomainUrl = `https://www.trustpilot.com/review/${domain}`;
        // Optionally: fetch and check if this page exists and matches businessName
        const exists = await this.pageExistsAndMatches(trustpilotDomainUrl, businessName, domain);
        console.log('Tried Trustpilot domain URL:', trustpilotDomainUrl, 'Exists/Matches:', exists);
        if (exists) return trustpilotDomainUrl;
      }
      // 2. Google search with domain
      if (domain) {
        const googleUrl = `https://www.google.com/search?q=site:trustpilot.com+${encodeURIComponent(domain)}`;
        const scraperUrl = `http://api.scraperapi.com?api_key=${this.apiKey}&url=${encodeURIComponent(googleUrl)}&render=true`;
        const response = await fetch(scraperUrl, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (response.ok) {
          const html = await response.text();
          const match = html.match(/https:\/\/www\.trustpilot\.com\/review\/[a-zA-Z0-9\-\.]+/);
          if (match) {
            const foundUrl = match[0];
            const exists = await this.pageExistsAndMatches(foundUrl, businessName, domain);
            console.log('Google domain search found:', foundUrl, 'Exists/Matches:', exists);
            if (exists) return foundUrl;
          }
        }
      }
      // 3. Google search with business name
      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(businessName + ' site:trustpilot.com')}`;
      const scraperUrl = `http://api.scraperapi.com?api_key=${this.apiKey}&url=${encodeURIComponent(googleUrl)}&render=true`;
      const response = await fetch(scraperUrl, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (response.ok) {
        const html = await response.text();
        const match = html.match(/https:\/\/www\.trustpilot\.com\/review\/[a-zA-Z0-9\-\.]+/);
        if (match) {
          const foundUrl = match[0];
          const exists = await this.pageExistsAndMatches(foundUrl, businessName, domain);
          console.log('Google name search found:', foundUrl, 'Exists/Matches:', exists);
          if (exists) return foundUrl;
        }
      }
      // 4. Fallback: use businessName as slug
      if (businessName) {
        const fallbackUrl = `https://www.trustpilot.com/review/${businessName}`;
        const exists = await this.pageExistsAndMatches(fallbackUrl, businessName, domain);
        console.log('Fallback Trustpilot URL:', fallbackUrl, 'Exists/Matches:', exists);
        if (exists) return fallbackUrl;
      }
      return null;
    } catch (e) {
      console.error('Error finding Trustpilot URL:', e);
      return null;
    }
  }

  // AI/heuristic validation: check if the Trustpilot page matches the business name and domain
  async pageExistsAndMatches(url: string, businessName: string, domain: string): Promise<boolean> {
    try {
      const scraperUrl = `http://api.scraperapi.com?api_key=${this.apiKey}&url=${encodeURIComponent(url)}&render=true`;
      const response = await fetch(scraperUrl, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!response.ok) return false;
      const html = await response.text();
      // Heuristic: check if domain or businessName appears in the page title or meta tags
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].toLowerCase() : '';
      if (title.includes(domain.toLowerCase()) || title.includes(businessName.toLowerCase())) return true;
      // Optionally: use AI/LLM API to further validate (pseudo-code)
      // const aiResult = await callLLM(`Does this Trustpilot page match the business '${businessName}' and domain '${domain}'? HTML: ...`)
      // if (aiResult.match) return true;
      return false;
    } catch (e) {
      return false;
    }
  }

  // Parse Trustpilot reviews
  parseTrustpilotReviews(html: string): Review[] {
    const reviews: Review[] = []
    
    try {
      // Look for JSON-LD structured data first
      const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)
      if (jsonLdMatches) {
        for (const match of jsonLdMatches) {
          try {
            const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '')
            const data = JSON.parse(jsonContent)
            if (data['@type'] === 'Review' || data['@type'] === 'AggregateRating') {
              if (data.reviewBody) {
                reviews.push({
                  text: data.reviewBody,
                  rating: data.reviewRating?.ratingValue,
                  source: 'Trustpilot',
                  author: data.author?.name || 'Anonymous'
                })
              }
            }
          } catch (e) {
            // Continue if JSON parsing fails
          }
        }
      }
      
      // Look for review cards in HTML
      const reviewCardPatterns = [
        /<article[^>]*class="[^"]*review[^"]*"[^>]*>.*?<p[^>]*>(.*?)<\/p>/gs,
        /<div[^>]*class="[^"]*review[^"]*"[^>]*>.*?<p[^>]*>(.*?)<\/p>/gs,
        /<div[^>]*data-service-review[^>]*>.*?<p[^>]*>(.*?)<\/p>/gs
      ]
      
      for (const pattern of reviewCardPatterns) {
        const matches = html.match(pattern)
        if (matches) {
          matches.forEach(match => {
            try {
              const text = this.cleanHtml(match[1] || match[0])
              if (text.length > 20) {
                reviews.push({ text, source: 'Trustpilot' })
              }
            } catch {}
          })
        }
      }
      
      // Fallback to generic patterns
      if (reviews.length === 0) {
        const reviewPatterns = [
          /<p[^>]*class="[^\"]*review[^\"]*\"[^>]*>(.*?)<\/p>/gs,
          /<div[^>]*class="[^\"]*review[^\"]*\"[^>]*>(.*?)<\/div>/gs,
          /<[^>]*class="[^\"]*content[^\"]*\"[^>]*>(.*?)<\/[a-z]+>/gs,
          /<article[^>]*>(.*?)<\/article>/gs
        ]
        for (const pattern of reviewPatterns) {
          const matches = html.match(pattern)
          if (matches) {
            matches.forEach(match => {
              try {
                const text = this.cleanHtml(match[1] || match[0])
                if (text.length > 20) {
                  reviews.push({ text, source: 'Trustpilot' })
                }
              } catch {}
            })
          }
        }
      }
    } catch (e) {
      console.error('Error parsing Trustpilot reviews:', e)
    }
    return reviews
  }

  // Parse Google reviews
  parseGoogleReviews(html: string): Review[] {
    const reviews: Review[] = []
    
    try {
      // Look for Google review patterns
      const reviewPatterns = [
        /<div[^>]*class="[^"]*review[^"]*"[^>]*>.*?<span[^>]*>(.*?)<\/span>/gs,
        /<div[^>]*class="[^"]*comment[^"]*"[^>]*>(.*?)<\/div>/gs,
        /<div[^>]*data-review[^>]*>.*?<span[^>]*>(.*?)<\/span>/gs,
        /<div[^>]*class="[^"]*user-review[^"]*"[^>]*>(.*?)<\/div>/gs,
        /<div[^>]*class="[^"]*review-text[^"]*"[^>]*>(.*?)<\/div>/gs
      ]

      for (const pattern of reviewPatterns) {
        const matches = html.match(pattern)
        if (matches) {
          matches.forEach(match => {
            const text = this.cleanHtml(match[1] || match[0])
            if (text && text.length > 10) {
              reviews.push({
                text,
                source: 'Google',
                author: 'Anonymous'
              })
            }
          })
          break
        }
      }
    } catch (error) {
      console.error('Error parsing Google reviews:', error)
    }

    return reviews
  }

  // Parse Reddit reviews/comments
  parseRedditReviews(html: string): Review[] {
    const reviews: Review[] = []
    
    try {
      // Reddit comment patterns
      const commentPatterns = [
        /<div[^>]*class="[^"]*comment[^"]*"[^>]*>.*?<p[^>]*>(.*?)<\/p>/gs,
        /<div[^>]*data-testid="comment"[^>]*>.*?<p[^>]*>(.*?)<\/p>/gs,
        /<div[^>]*class="[^"]*Post[^"]*"[^>]*>.*?<p[^>]*>(.*?)<\/p>/gs,
        /<div[^>]*class="[^"]*RichText[^"]*"[^>]*>(.*?)<\/div>/gs,
        /<div[^>]*class="[^"]*md[^"]*"[^>]*>(.*?)<\/div>/gs
      ]

      for (const pattern of commentPatterns) {
        const matches = html.match(pattern)
        if (matches) {
          matches.forEach(match => {
            const text = this.cleanHtml(match[1] || match[0])
            if (text && text.length > 10) {
              reviews.push({
                text,
                source: 'Reddit',
                author: 'Anonymous'
              })
            }
          })
          break
        }
      }
    } catch (error) {
      console.error('Error parsing Reddit reviews:', error)
    }

    return reviews
  }

  // Parse Yelp reviews
  parseYelpReviews(html: string): Review[] {
    const reviews: Review[] = []
    
    try {
      // Yelp review patterns
      const reviewPatterns = [
        /<p[^>]*class="[^"]*comment[^"]*"[^>]*>(.*?)<\/p>/gs,
        /<span[^>]*class="[^"]*review[^"]*"[^>]*>(.*?)<\/span>/gs,
        /<div[^>]*class="[^"]*review-content[^"]*"[^>]*>(.*?)<\/div>/gs,
        /<div[^>]*class="[^"]*review-text[^"]*"[^>]*>(.*?)<\/div>/gs
      ]

      for (const pattern of reviewPatterns) {
        const matches = html.match(pattern)
        if (matches) {
          matches.forEach(match => {
            const text = this.cleanHtml(match[1] || match[0])
            if (text && text.length > 10) {
              reviews.push({
                text,
                source: 'Yelp',
                author: 'Anonymous'
              })
            }
          })
          break
        }
      }
    } catch (error) {
      console.error('Error parsing Yelp reviews:', error)
    }

    return reviews
  }

  // Parse TripAdvisor reviews
  parseTripAdvisorReviews(html: string): Review[] {
    const reviews: Review[] = []
    
    try {
      // TripAdvisor review patterns
      const reviewPatterns = [
        /<p[^>]*class="[^"]*review[^"]*"[^>]*>(.*?)<\/p>/gs,
        /<div[^>]*class="[^"]*comment[^"]*"[^>]*>(.*?)<\/div>/gs,
        /<div[^>]*class="[^"]*review-content[^"]*"[^>]*>(.*?)<\/div>/gs,
        /<div[^>]*class="[^"]*review-text[^"]*"[^>]*>(.*?)<\/div>/gs
      ]

      for (const pattern of reviewPatterns) {
        const matches = html.match(pattern)
        if (matches) {
          matches.forEach(match => {
            const text = this.cleanHtml(match[1] || match[0])
            if (text && text.length > 10) {
              reviews.push({
                text,
                source: 'TripAdvisor',
                author: 'Anonymous'
              })
            }
          })
          break
        }
      }
    } catch (error) {
      console.error('Error parsing TripAdvisor reviews:', error)
    }

    return reviews
  }

  // Generic review parsing for unknown platforms
  parseGenericReviews(html: string, platform: string): Review[] {
    const reviews: Review[] = []
    
    try {
      // Generic patterns that might work across platforms
      const genericPatterns = [
        /<div[^>]*class="[^"]*review[^"]*"[^>]*>(.*?)<\/div>/gs,
        /<p[^>]*class="[^"]*review[^"]*"[^>]*>(.*?)<\/p>/gs,
        /<div[^>]*class="[^"]*comment[^"]*"[^>]*>(.*?)<\/div>/gs,
        /<p[^>]*class="[^"]*comment[^"]*"[^>]*>(.*?)<\/p>/gs,
        /<div[^>]*class="[^"]*content[^"]*"[^>]*>(.*?)<\/div>/gs,
        /<article[^>]*>(.*?)<\/article>/gs
      ]

      for (const pattern of genericPatterns) {
        const matches = html.match(pattern)
        if (matches) {
          matches.forEach(match => {
            const text = this.cleanHtml(match[1] || match[0])
            if (text && text.length > 20) {
              reviews.push({
                text,
                source: platform,
                author: 'Anonymous'
              })
            }
          })
          break
        }
      }
    } catch (error) {
      console.error(`Error parsing generic reviews for ${platform}:`, error)
    }

    return reviews
  }

  // Clean HTML tags from text
  cleanHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }

  // Store reviews in database
  async storeReviews(companyId: string, reviews: Review[]): Promise<void> {
    if (reviews.length === 0) return;

    // Skip database storage if Supabase is not configured (test mode)
    const supabase = this.getSupabaseClient();
    if (!supabase) {
      console.log(`Test mode: Would store ${reviews.length} reviews for company ${companyId}`);
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert(reviews.map((review, index) => ({
          company_id: companyId,
          text: review.text,
          rating: review.rating,
          source: review.source,
          author: review.author,
          external_review_id: `${review.source}_${Date.now()}_${index}`,
          created_at: new Date().toISOString()
        })));

      if (error) {
        console.error('Error storing reviews:', error);
      } else {
        console.log(`Stored ${reviews.length} reviews for company ${companyId}`);
      }
    } catch (error) {
      console.error('Error storing reviews:', error);
    }
  }
} 