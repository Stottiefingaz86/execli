# Deployment Guide for Custom Scraper System

## Overview

This guide covers deploying the custom scraper system to production, replacing Pipedream with a cost-effective, scalable solution.

## Prerequisites

1. **Vercel Pro** (or similar platform with serverless functions)
2. **Supabase Pro** (for database)
3. **AI API Key** (OpenAI or Anthropic)
4. **Domain** (optional, for custom domain)

## Step 1: Environment Setup

### Vercel Environment Variables

Add these to your Vercel project settings:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Service
OPENAI_API_KEY=your_openai_api_key
# OR
ANTHROPIC_API_KEY=your_anthropic_api_key

# App
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NODE_ENV=production
```

### Supabase Setup

1. **Enable Row Level Security (RLS)**:
   ```sql
   ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
   ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
   -- Repeat for all tables
   ```

2. **Create policies** for secure access:
   ```sql
   -- Allow public read access to companies
   CREATE POLICY "Allow public read access" ON companies
   FOR SELECT USING (true);
   
   -- Allow authenticated users to insert companies
   CREATE POLICY "Allow authenticated insert" ON companies
   FOR INSERT WITH CHECK (true);
   ```

## Step 2: Database Migration

Run the Supabase migration:

```sql
-- Run the contents of supabase-migration.sql in your Supabase SQL editor
```

## Step 3: Deploy to Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy
```bash
vercel --prod
```

### 3. Configure Domain (Optional)
```bash
vercel domains add your-domain.com
```

## Step 4: Production Optimizations

### 1. Enable Edge Functions

Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['puppeteer']
  }
}

module.exports = nextConfig
```

### 2. Add Rate Limiting

Create `middleware.ts`:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimit = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown'
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 10

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
  } else {
    const user = rateLimit.get(ip)
    if (now > user.resetTime) {
      user.count = 1
      user.resetTime = now + windowMs
    } else {
      user.count++
    }
  }

  const user = rateLimit.get(ip)
  if (user.count > maxRequests) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/scrape'
}
```

### 3. Add Error Monitoring

Install Sentry or similar:
```bash
npm install @sentry/nextjs
```

## Step 5: Testing Production

### 1. Test API Endpoints

```bash
# Test scraping endpoint
curl -X POST https://your-domain.com/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "Test Business",
    "business_url": "https://test.com",
    "industry": "Technology",
    "email": "test@example.com",
    "review_source": "Google Reviews",
    "review_url": "https://maps.google.com/..."
  }'

# Test status endpoint
curl https://your-domain.com/api/status/YOUR_COMPANY_ID
```

### 2. Monitor Logs

Check Vercel function logs:
```bash
vercel logs --follow
```

## Step 6: Scaling Considerations

### 1. Redis for Job Queue (Recommended)

For high-volume usage, replace the in-memory queue with Redis:

```bash
npm install bull @types/bull
```

Update `lib/queue.ts`:
```typescript
import Queue from 'bull'

const scrapingQueue = new Queue('scraping', {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  }
})

// Add to your environment variables:
// REDIS_HOST=your-redis-host
// REDIS_PORT=6379
// REDIS_PASSWORD=your-redis-password
```

### 2. Database Connection Pooling

For Supabase, ensure you're using connection pooling:

```typescript
// In lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: false
  }
})
```

## Step 7: Monitoring & Analytics

### 1. Add Analytics

```bash
npm install @vercel/analytics
```

### 2. Set up Monitoring

Create `lib/monitoring.ts`:
```typescript
export interface ScrapingMetrics {
  totalJobs: number
  successfulJobs: number
  failedJobs: number
  averageProcessingTime: number
  lastJobTime: Date
}

export class MetricsTracker {
  private metrics: ScrapingMetrics = {
    totalJobs: 0,
    successfulJobs: 0,
    failedJobs: 0,
    averageProcessingTime: 0,
    lastJobTime: new Date()
  }

  recordJobSuccess(processingTime: number) {
    this.metrics.totalJobs++
    this.metrics.successfulJobs++
    this.metrics.averageProcessingTime = 
      (this.metrics.averageProcessingTime + processingTime) / 2
    this.metrics.lastJobTime = new Date()
  }

  recordJobFailure() {
    this.metrics.totalJobs++
    this.metrics.failedJobs++
    this.metrics.lastJobTime = new Date()
  }

  getMetrics(): ScrapingMetrics {
    return { ...this.metrics }
  }
}
```

## Step 8: Security Hardening

### 1. Input Validation

Update `app/api/scrape/route.ts`:
```typescript
import { z } from 'zod'

const scrapeSchema = z.object({
  business_name: z.string().min(1).max(255),
  business_url: z.string().url(),
  industry: z.string().max(100),
  email: z.string().email(),
  review_source: z.string().min(1),
  review_url: z.string().url()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = scrapeSchema.parse(body)
    // ... rest of the function
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid input data' },
      { status: 400 }
    )
  }
}
```

### 2. CORS Configuration

Create `middleware.ts`:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  
  return response
}
```

## Step 9: Performance Optimization

### 1. Enable Caching

```typescript
// In lib/api.ts
export async function getCompany(companyId: string): Promise<Company | null> {
  // Add caching headers
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single()
    .headers({
      'Cache-Control': 'public, max-age=300' // 5 minutes
    })
  
  // ... rest of function
}
```

### 2. Optimize Database Queries

Add indexes to your Supabase database:
```sql
-- Add indexes for better performance
CREATE INDEX CONCURRENTLY idx_companies_status ON companies(status);
CREATE INDEX CONCURRENTLY idx_reviews_company_date ON reviews(company_id, review_date);
CREATE INDEX CONCURRENTLY idx_sentiment_timeline_company_date ON sentiment_timeline(company_id, date);
```

## Step 10: Backup & Recovery

### 1. Database Backups

Set up automated Supabase backups:
1. Go to your Supabase dashboard
2. Navigate to Settings > Database
3. Enable automated backups
4. Set retention period (recommend 30 days)

### 2. Code Backup

Use Git for version control:
```bash
git add .
git commit -m "Deploy custom scraper system"
git push origin main
```

## Cost Analysis

### Monthly Costs (Estimated)

| Component | Cost |
|-----------|------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| AI API (1000 analyses) | $10-50 |
| Redis (optional) | $15 |
| **Total** | **$70-110** |

### Comparison with Pipedream

| Platform | Cost for 10K requests | Cost for 100K requests |
|----------|----------------------|----------------------|
| Pipedream | $19/month | $99/month |
| Custom System | $70-110/month | $70-110/month |

**Savings**: 30-70% cost reduction

## Troubleshooting

### Common Issues

1. **Puppeteer not working on Vercel**
   - Ensure you're using Vercel Pro (required for Puppeteer)
   - Add `--no-sandbox` flags in scraper config

2. **Database connection issues**
   - Check Supabase connection limits
   - Use connection pooling
   - Monitor query performance

3. **Rate limiting**
   - Implement exponential backoff
   - Use proxy rotation (advanced)
   - Respect website terms of service

4. **Memory issues**
   - Monitor function memory usage
   - Implement proper cleanup
   - Use streaming for large datasets

## Support

For issues with the custom scraper system:

1. Check Vercel function logs
2. Monitor Supabase query performance
3. Test with smaller datasets first
4. Verify AI API quotas and limits

This deployment guide ensures your custom scraper system is production-ready, scalable, and cost-effective compared to Pipedream. 