// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { encode as btoa } from "https://deno.land/std@0.168.0/encoding/base64.ts";

// Types
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

// Scraper class for Edge Function
class ScraperAPIVOCScraper {
  private apiKey: string;
  private supabase: any;

  constructor(supabase: any) {
    this.apiKey = Deno.env.get('SCRAPERAPI_API_KEY') || '';
    this.supabase = supabase;
    
    if (!this.apiKey) {
      throw new Error('SCRAPERAPI_API_KEY is required');
    }
  }

  // Helper to update report progress
  async updateProgress(reportId: string, message: string, status: string = 'processing') {
    if (this.supabase) {
      await this.supabase.from('voc_reports').update({ progress_message: message, status }).eq('id', reportId);
    }
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
        await this.updateProgress(reportId, progressMessage);
        
        console.log(`Scraping ${platform.name}...`);
        const result = await this.scrapePlatform(platform.name, platform.url, businessName);
        results.push(result);
        
        // Store reviews if successful
        if (result.success && result.reviews.length > 0) {
          await this.storeReviews(companyId, result.reviews);
        }
        
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

  // Find Trustpilot URL using domain and business name
  async findTrustpilotUrl(businessName: string, businessUrl?: string): Promise<string | null> {
    try {
      // If we have a business URL, try to extract domain
      if (businessUrl) {
        const domain = this.extractDomain(businessUrl);
        if (domain) {
          // Try domain-based Trustpilot URL first
          const domainUrl = `https://www.trustpilot.com/review/${domain}`;
          console.log(`Trying domain-based Trustpilot URL: ${domainUrl}`);
          
          // Check if this page exists and matches the business
          const exists = await this.pageExistsAndMatches(domainUrl, businessName, domain);
          if (exists) {
            return domainUrl;
          }
        }
      }

      // Fallback: Use Google search to find Trustpilot page
      const searchQuery = `${businessName} site:trustpilot.com`;
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      
      console.log(`Searching for Trustpilot page: ${googleSearchUrl}`);
      
      const scraperUrl = `http://api.scraperapi.com?api_key=${this.apiKey}&url=${encodeURIComponent(googleSearchUrl)}&render=true`;
      const response = await fetch(scraperUrl);
      
      if (!response.ok) {
        console.log('Google search failed, using fallback URL');
        return null;
      }

      const html = await response.text();
      
      // Extract Trustpilot URLs from Google search results
      const trustpilotUrls = this.extractTrustpilotUrls(html);
      
      for (const url of trustpilotUrls) {
        const exists = await this.pageExistsAndMatches(url, businessName, businessUrl ? this.extractDomain(businessUrl) : '');
        if (exists) {
          return url;
        }
      }

      return null;
    } catch (error) {
      console.error('Error finding Trustpilot URL:', error);
      return null;
    }
  }

  // Check if a page exists and matches the business
  async pageExistsAndMatches(url: string, businessName: string, domain: string): Promise<boolean> {
    try {
      const scraperUrl = `http://api.scraperapi.com?api_key=${this.apiKey}&url=${encodeURIComponent(url)}&render=true`;
      const response = await fetch(scraperUrl);
      
      if (!response.ok) {
        return false;
      }

      const html = await response.text();
      
      // Simple validation: check if business name appears in title or content
      const titleMatch = html.toLowerCase().includes(businessName.toLowerCase());
      const domainMatch = domain && html.toLowerCase().includes(domain.toLowerCase());
      
      return titleMatch || domainMatch;
    } catch (error) {
      console.error('Error checking page existence:', error);
      return false;
    }
  }

  // Extract domain from URL
  extractDomain(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return null;
    }
  }

  // Extract Trustpilot URLs from Google search results
  extractTrustpilotUrls(html: string): string[] {
    const urls: string[] = [];
    const regex = /https:\/\/www\.trustpilot\.com\/review\/[^"'\s]+/g;
    const matches = html.match(regex);
    
    if (matches) {
      urls.push(...matches);
    }
    
    return urls;
  }

  // Parse reviews based on platform
  async parseReviews(platform: string, html: string, businessName: string): Promise<Review[]> {
    const cleanHtml = this.cleanHtml(html);
    
    switch (platform.toLowerCase()) {
      case 'trustpilot':
        return this.parseTrustpilotReviews(cleanHtml);
      case 'google':
        return this.parseGoogleReviews(cleanHtml);
      case 'reddit':
        return this.parseRedditReviews(cleanHtml);
      case 'yelp':
        return this.parseYelpReviews(cleanHtml);
      case 'tripadvisor':
        return this.parseTripAdvisorReviews(cleanHtml);
      default:
        return this.parseGenericReviews(cleanHtml, platform);
    }
  }

  // Parse Trustpilot reviews
  parseTrustpilotReviews(html: string): Review[] {
    const reviews: Review[] = [];
    
    // Look for review containers
    const reviewRegex = /<article[^>]*class="[^"]*review[^"]*"[^>]*>.*?<\/article>/gs;
    const matches = html.match(reviewRegex);
    
    if (matches) {
      for (const match of matches) {
        try {
          // Extract review text
          const textMatch = match.match(/<p[^>]*class="[^"]*typography_body[^"]*"[^>]*>(.*?)<\/p>/s);
          const text = textMatch ? this.cleanHtml(textMatch[1]) : '';
          
          if (text && text.length > 10) {
            // Extract rating
            const ratingMatch = match.match(/data-service-review-rating="(\d+)"/);
            const rating = ratingMatch ? parseInt(ratingMatch[1]) : undefined;
            
            // Extract date
            const dateMatch = match.match(/datetime="([^"]+)"/);
            const date = dateMatch ? dateMatch[1] : undefined;
            
            reviews.push({
              text,
              rating,
              date,
              source: 'Trustpilot',
              author: 'Anonymous'
            });
          }
        } catch (error) {
          console.error('Error parsing Trustpilot review:', error);
        }
      }
    }
    
    return reviews;
  }

  // Parse Google reviews
  parseGoogleReviews(html: string): Review[] {
    const reviews: Review[] = [];
    
    // Look for review text in Google search results
    const reviewRegex = /<div[^>]*class="[^"]*review[^"]*"[^>]*>(.*?)<\/div>/gs;
    const matches = html.match(reviewRegex);
    
    if (matches) {
      for (const match of matches) {
        const text = this.cleanHtml(match);
        if (text && text.length > 10) {
          reviews.push({
            text,
            source: 'Google',
            author: 'Anonymous'
          });
        }
      }
    }
    
    return reviews;
  }

  // Parse Reddit reviews
  parseRedditReviews(html: string): Review[] {
    const reviews: Review[] = [];
    
    // Look for Reddit post content
    const postRegex = /<div[^>]*class="[^"]*post[^"]*"[^>]*>(.*?)<\/div>/gs;
    const matches = html.match(postRegex);
    
    if (matches) {
      for (const match of matches) {
        const text = this.cleanHtml(match);
        if (text && text.length > 10) {
          reviews.push({
            text,
            source: 'Reddit',
            author: 'Anonymous'
          });
        }
      }
    }
    
    return reviews;
  }

  // Parse Yelp reviews
  parseYelpReviews(html: string): Review[] {
    const reviews: Review[] = [];
    
    // Look for Yelp review containers
    const reviewRegex = /<div[^>]*class="[^"]*review[^"]*"[^>]*>(.*?)<\/div>/gs;
    const matches = html.match(reviewRegex);
    
    if (matches) {
      for (const match of matches) {
        const text = this.cleanHtml(match);
        if (text && text.length > 10) {
          reviews.push({
            text,
            source: 'Yelp',
            author: 'Anonymous'
          });
        }
      }
    }
    
    return reviews;
  }

  // Parse TripAdvisor reviews
  parseTripAdvisorReviews(html: string): Review[] {
    const reviews: Review[] = [];
    
    // Look for TripAdvisor review containers
    const reviewRegex = /<div[^>]*class="[^"]*review[^"]*"[^>]*>(.*?)<\/div>/gs;
    const matches = html.match(reviewRegex);
    
    if (matches) {
      for (const match of matches) {
        const text = this.cleanHtml(match);
        if (text && text.length > 10) {
          reviews.push({
            text,
            source: 'TripAdvisor',
            author: 'Anonymous'
          });
        }
      }
    }
    
    return reviews;
  }

  // Parse generic reviews
  parseGenericReviews(html: string, platform: string): Review[] {
    const reviews: Review[] = [];
    
    // Look for any text content that might be reviews
    const textRegex = /<p[^>]*>(.*?)<\/p>/gs;
    const matches = html.match(textRegex);
    
    if (matches) {
      for (const match of matches) {
        const text = this.cleanHtml(match);
        if (text && text.length > 20 && text.length < 1000) {
          reviews.push({
            text,
            source: platform,
            author: 'Anonymous'
          });
        }
      }
    }
    
    return reviews;
  }

  // Clean HTML content
  cleanHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Store reviews in database
  async storeReviews(companyId: string, reviews: Review[]): Promise<void> {
    if (!this.supabase || reviews.length === 0) return;
    
    try {
      const reviewData = reviews.map(review => ({
        company_id: companyId,
        text: review.text,
        rating: review.rating,
        date: review.date,
        source: review.source,
        url: review.url,
        author: review.author
      }));
      
      const { error } = await this.supabase
        .from('reviews')
        .insert(reviewData);
      
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

// Helper: Extract JSON from OpenAI response
function extractJsonFromOpenAI(content: string): any {
  // Try to extract JSON from a markdown code block
  const match = content.match(/```json\s*([\s\S]*?)```/i);
  if (match) {
    return JSON.parse(match[1]);
  }
  // Fallback: try to find the first { ... } block
  const curlyMatch = content.match(/{[\s\S]*}/);
  if (curlyMatch) {
    return JSON.parse(curlyMatch[0]);
  }
  throw new Error('No JSON found in OpenAI response');
}

// Helper: Use OpenAI to get review URLs for a business
async function getReviewSourceUrls(businessName: string, businessUrl: string): Promise<{ [platform: string]: string }> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) throw new Error('Missing OPENAI_API_KEY');
  const prompt = `Given the business name "${businessName}" and website "${businessUrl}", find the most likely review pages for this business on Trustpilot, Google Reviews, Yelp, Reddit, and TripAdvisor. Return a JSON object with keys for each platform and the best-matching URL as the value. If not found, use null.`;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400
    })
  });
  const data = await response.json();
  try {
    return extractJsonFromOpenAI(data.choices[0].message.content);
  } catch (e) {
    throw new Error('Failed to parse OpenAI review source URLs: ' + data.choices[0].message.content);
  }
}

// Helper: Use OpenAI to analyze reviews
async function analyzeReviewsWithOpenAI(reviews: Review[], businessName: string): Promise<any> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) throw new Error('Missing OPENAI_API_KEY');
  const reviewTexts = reviews.map(r => `- ${r.text}`).join("\n");
  const prompt = `You are an expert in customer experience analysis. Given the following reviews for the business \"${businessName}\":\n${reviewTexts}\n\nSummarize the main themes, sentiment, and actionable insights. Return a JSON object with keys: summary, sentiment, themes (array), and recommendations (array).`;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600
    })
  });
  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (e) {
    return { summary: data.choices[0].message.content };
  }
}

serve(async (req) => {
  try {
    const { report_id, company_id, business_name, business_url, email } = await req.json();

    // Log environment and input for debugging
    console.log('Edge Function invoked for report:', report_id);
    console.log('Business name:', business_name);
    console.log('SCRAPERAPI_API_KEY:', (Deno.env.get('SCRAPERAPI_API_KEY') || '').slice(0, 6) + '****');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Helper to update report progress
    async function updateProgress(message: string, status: string = 'processing') {
      await supabase.from('voc_reports').update({ progress_message: message, status }).eq('id', report_id);
    }

    // 1. Initializing (already set by API route)
    await updateProgress('Initializing report...');

    // 1. Use OpenAI to get review source URLs
    await updateProgress('Finding review sources with AI...');
    let reviewSourceUrls: { [platform: string]: string } = {};
    try {
      reviewSourceUrls = await getReviewSourceUrls(business_name, business_url);
      console.log('AI-discovered review source URLs:', reviewSourceUrls);
    } catch (err) {
      console.error('Error with OpenAI review source discovery:', err);
      await updateProgress('Error finding review sources: ' + (err.message || err), 'error');
      return new Response(JSON.stringify({ error: 'Error finding review sources' }), { status: 500 });
    }

    // 2. Only create scraper if there are URLs to scrape
    const urlsToScrape = Object.entries(reviewSourceUrls).filter(([_, url]) => !!url);
    let allReviews: Review[] = [];
    let scrapingResults: ScrapingResult[] = [];
    if (urlsToScrape.length > 0) {
      await updateProgress('Scraping reviews from sources...');
      try {
        const scraper = new ScraperAPIVOCScraper(supabase);
        for (const [platform, url] of urlsToScrape) {
          const result = await scraper.scrapePlatform(platform, url, business_name);
          scrapingResults.push(result);
          if (result.success && result.reviews.length > 0) {
            allReviews = allReviews.concat(result.reviews);
            await scraper.storeReviews(company_id, result.reviews);
          }
          await updateProgress(`Scraped ${platform} (${result.reviewCount} reviews)`);
        }
      } catch (err) {
        console.error('Error during scraping:', err);
        await updateProgress('Error during scraping: ' + (err.message || err), 'error');
        return new Response(JSON.stringify({ error: 'Error during scraping' }), { status: 500 });
      }
    }

    // 3. Analyze reviews with OpenAI
    await updateProgress('Analyzing customer feedback with AI...');
    let analysis: any = {};
    try {
      if (allReviews.length > 0) {
        analysis = await analyzeReviewsWithOpenAI(allReviews, business_name);
      } else {
        analysis = { summary: 'No reviews found to analyze.' };
      }
    } catch (err) {
      console.error('Error during AI analysis:', err);
      await updateProgress('Error during analysis: ' + (err.message || err), 'error');
      return new Response(JSON.stringify({ error: 'Error during analysis' }), { status: 500 });
    }

    // 4. Save analysis and mark report complete
    await updateProgress('Generating insights and charts...');
    await supabase.from('voc_reports').update({ analysis, sources: Object.entries(reviewSourceUrls).map(([platform, url]) => ({ platform, url })), status: 'complete' }).eq('id', report_id);
    await updateProgress('Report ready!', 'complete');

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/process-voc-report' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
