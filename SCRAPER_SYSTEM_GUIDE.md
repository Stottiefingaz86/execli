# Custom Scraper System Guide

## Overview

This guide explains how to use our custom universal scraper system that replaces Pipedream's expensive workflow. The system is designed to be cost-effective, scalable, and fully customizable.

## Architecture

### Components

1. **Universal Scraper** (`lib/scraper.ts`)
   - Handles scraping from multiple review platforms
   - Uses Puppeteer for browser automation
   - Configurable selectors for different platforms

2. **Job Queue** (`lib/queue.ts`)
   - Manages scraping tasks in background
   - Prevents server overload
   - Tracks job status and progress

3. **API Routes**
   - `/api/scrape` - Submit new scraping jobs
   - `/api/status/[companyId]` - Check job status

4. **Database Integration**
   - Stores scraped reviews and analysis
   - Tracks company and job status
   - Integrates with existing Supabase schema

## Setup

### 1. Install Dependencies

```bash
npm install puppeteer
```

### 2. Environment Variables

Add these to your `.env.local`:

```env
# AI Service (choose one)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Configure AI Service

Edit `lib/scraper.ts` and uncomment the AI service you want to use:

```typescript
// For OpenAI
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
    max_tokens: 4000
  })
})

// For Anthropic
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  })
})
```

## Supported Platforms

### Currently Supported

1. **Google Reviews**
   - Selectors: `[data-review-id]`, `[data-reviewer-name]`, etc.
   - Max pages: 3
   - Delay: 2 seconds

2. **Yelp**
   - Selectors: `.review`, `.reviewer-name`, `.stars`, etc.
   - Max pages: 5
   - Delay: 1.5 seconds

3. **Trustpilot**
   - Selectors: `[data-service-review-card]`, etc.
   - Max pages: 3
   - Delay: 2 seconds

4. **TripAdvisor**
   - Selectors: `.review-container`, `.ui_bubble_rating`, etc.
   - Max pages: 3
   - Delay: 2 seconds

### Adding New Platforms

To add a new platform, update `SCRAPER_CONFIGS` in `lib/scraper.ts`:

```typescript
'New Platform': {
  name: 'New Platform',
  baseUrl: 'https://newplatform.com',
  selectors: {
    reviewContainer: '.review-item',
    reviewerName: '.reviewer-name',
    rating: '.rating-stars',
    reviewText: '.review-content',
    reviewDate: '.review-date',
    nextPage: '.next-page-button'
  },
  maxPages: 3,
  delay: 2000
}
```

## Usage

### 1. Submit a Scraping Job

```javascript
const response = await fetch('/api/scrape', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    business_name: 'Acme Corp',
    business_url: 'https://acme.com',
    industry: 'Technology',
    email: 'user@example.com',
    review_source: 'Google Reviews',
    review_url: 'https://maps.google.com/...'
  })
})

const result = await response.json()
// { success: true, company_id: "...", status: "processing" }
```

### 2. Check Job Status

```javascript
const response = await fetch(`/api/status/${companyId}`)
const status = await response.json()
// { status: "processing", job_status: "processing", ... }
```

### 3. View Results

Once complete, view the report at `/report/${companyId}`

## Cost Comparison

### Pipedream Costs
- **Free tier**: 1,000 invocations/month
- **Paid tier**: $19/month for 10,000 invocations
- **High volume**: $99/month for 100,000 invocations

### Custom System Costs
- **Server costs**: ~$20-50/month (Vercel Pro or similar)
- **AI API costs**: ~$0.01-0.10 per analysis
- **Database costs**: ~$25/month (Supabase Pro)
- **Total**: ~$50-100/month for unlimited usage

**Savings**: 50-80% cost reduction for high-volume usage

## Production Considerations

### 1. Job Queue Scaling

For production, replace the in-memory queue with Redis + Bull/BullMQ:

```bash
npm install bull @types/bull
```

```typescript
import Queue from 'bull'

const scrapingQueue = new Queue('scraping', {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  }
})
```

### 2. Rate Limiting

Add rate limiting to prevent abuse:

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
})
```

### 3. Error Handling

Implement retry logic for failed scrapes:

```typescript
// In lib/scraper.ts
async scrapeWithRetry(url: string, config: ScraperConfig, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await this.scrapeReviews(url, config)
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 5000 * (i + 1)))
    }
  }
}
```

### 4. Monitoring

Add monitoring for job success/failure rates:

```typescript
// Track metrics
const metrics = {
  totalJobs: 0,
  successfulJobs: 0,
  failedJobs: 0,
  averageProcessingTime: 0
}
```

## Troubleshooting

### Common Issues

1. **Puppeteer not launching**
   - Ensure you're on a Linux server (Vercel, Railway, etc.)
   - Add `--no-sandbox` and `--disable-setuid-sandbox` flags

2. **Selectors not working**
   - Websites change their HTML structure
   - Update selectors in `SCRAPER_CONFIGS`
   - Test selectors manually in browser dev tools

3. **Rate limiting**
   - Increase delays between requests
   - Use proxy rotation (advanced)
   - Implement exponential backoff

4. **AI analysis failing**
   - Check API key and quota
   - Verify prompt format
   - Test with smaller review sets

### Debug Mode

Enable debug logging:

```typescript
// In lib/scraper.ts
const DEBUG = process.env.NODE_ENV === 'development'

if (DEBUG) {
  console.log('Scraping config:', config)
  console.log('Found reviews:', pageReviews.length)
}
```

## Advanced Features

### 1. Proxy Support

```typescript
// Add proxy support
const browser = await puppeteer.launch({
  args: [
    '--proxy-server=http://proxy.example.com:8080'
  ]
})
```

### 2. Custom Selectors

Allow users to provide custom selectors:

```typescript
interface CustomScraperConfig extends ScraperConfig {
  customSelectors?: {
    reviewContainer: string
    reviewerName?: string
    rating?: string
    reviewText: string
    reviewDate?: string
  }
}
```

### 3. Multi-Platform Scraping

Scrape from multiple sources simultaneously:

```typescript
async scrapeMultipleSources(companyId: string, sources: string[]) {
  const results = await Promise.allSettled(
    sources.map(source => this.scrapeReviews(source.url, source.config))
  )
  return results.filter(result => result.status === 'fulfilled')
}
```

## Security Considerations

1. **Input Validation**: Validate all URLs and business names
2. **Rate Limiting**: Prevent abuse and respect website terms
3. **Error Handling**: Don't expose internal errors to users
4. **Authentication**: Add user authentication for production use
5. **Data Privacy**: Ensure compliance with GDPR/CCPA

## Performance Optimization

1. **Concurrent Scraping**: Process multiple pages simultaneously
2. **Caching**: Cache analysis results to avoid re-processing
3. **Database Indexing**: Add proper indexes for fast queries
4. **CDN**: Use CDN for static assets
5. **Compression**: Enable gzip compression

## Migration from Pipedream

1. **Update API endpoints** in your frontend
2. **Test with small datasets** first
3. **Monitor performance** and adjust delays
4. **Update error handling** for new response formats
5. **Gradually migrate** existing workflows

This custom system gives you full control over your scraping workflow while significantly reducing costs compared to Pipedream. 